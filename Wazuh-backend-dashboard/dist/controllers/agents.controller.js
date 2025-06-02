"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentStats = exports.getAgents = void 0;
const event_model_1 = require("../models/event.model");
const getAgents = async (req, res) => {
    try {
        const agents = await event_model_1.Event.distinct('agent_id');
        res.json(agents);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAgents = getAgents;
const getAgentStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await event_model_1.Event.aggregate([
            { $match: { agent_id: id } },
            {
                $group: {
                    _id: "$agent_id",
                    totalEvents: { $sum: 1 },
                    lastEvent: { $max: "$timestamp" }
                }
            }
        ]);
        res.json(stats[0] || {});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAgentStats = getAgentStats;
