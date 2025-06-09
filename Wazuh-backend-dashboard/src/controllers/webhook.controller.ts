import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import logger from '../config/logger';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;
    
    // Validate and transform data if needed
    const event = new Event({
      agent_id: eventData.agent.id,
      timestamp: new Date(eventData.timestamp * 1000), // Convert if needed
      rule_id: eventData.rule.id,
      rule_description: eventData.rule.description,
      severity: eventData.rule.level,
      src_ip: eventData.srcip,
      dst_ip: eventData.dstip,
      user: eventData.data?.win?.eventdata?.user,
      event_data: eventData
    });

    await event.save();
    
    // Here you would also emit a WebSocket/Socket.io event for real-time updates
    // io.emit('new_event', event);
    
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Webhook error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};
