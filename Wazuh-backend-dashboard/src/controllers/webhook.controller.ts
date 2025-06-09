import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import logger from '../config/logger';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.agent || !eventData.rule) {
      throw new Error('Invalid Wazuh alert format');
    }

    // Transform and save the event
    const event = new Event({
      agent_id: eventData.agent.id || 'unknown',
      timestamp: new Date(eventData.timestamp * 1000 || Date.now()),
      rule_id: eventData.rule.id || 0,
      rule_description: eventData.rule.description || 'No description',
      severity: eventData.rule.level || 0,
      src_ip: eventData.srcip || null,
      dst_ip: eventData.dstip || null,
      user: eventData.data?.win?.eventdata?.user || null,
      event_data: eventData
    });

    await event.save();
    
    // Emit real-time event via Socket.io
    const io = req.app.get('io'); // Get Socket.io instance
    io.emit('new_event', { 
      id: event._id,
      agent_id: event.agent_id,
      severity: event.severity,
      timestamp: event.timestamp,
      rule_description: event.rule_description
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Webhook error: ${error}`);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
