const Request = require('../../models/servicesAndTires/request.model.js');

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const { vehicle, serviceType, priority, time, date, description, mileage, items, user } = req.body;
        const newRequest = new Request({
            vehicle,
            user,
            serviceType,
            priority,
            time,
            date,
            description,
            mileage,
            status: "Pendiente",
            items,
        });
        const savedRequest = await newRequest.save();
        res.json(savedRequest);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

exports.getRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.json(request);
    } catch (error) {
        return res.status(404).json({ message: "Request not found" });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ message: "Request not found" });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.json(request);
    } catch (error) {
        return res.status(404).json({ message: "Request not found" });
    }
};
