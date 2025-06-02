"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventStats = exports.getEvents = void 0;
const event_model_1 = require("../models/event.model");
const getEvents = async (req, res) => {
    try {
        const { limit = 100, offset = 0, severity, agent_id } = req.query;
        const filter = {};
        if (severity)
            filter.severity = severity;
        if (agent_id)
            filter.agent_id = agent_id;
        const events = await event_model_1.Event.find(filter)
            .sort({ timestamp: -1 })
            .skip(Number(offset))
            .limit(Number(limit));
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEvents = getEvents;
const getEventStats = async (req, res) => {
    try {
        const stats = await event_model_1.Event.aggregate([
            {
                $group: {
                    _id: null,
                    totalEvents: { $sum: 1 },
                    highSeverity: {
                        $sum: { $cond: [{ $gte: ["$severity", 10] }, 1, 0] }
                    },
                    agents: { $addToSet: "$agent_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalEvents: 1,
                    highSeverity: 1,
                    agentCount: { $size: "$agents" }
                }
            }
        ]);
        res.json(stats[0] || { totalEvents: 0, highSeverity: 0, agentCount: 0 });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEventStats = getEventStats;
