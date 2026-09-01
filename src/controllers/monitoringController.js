const monitoringService =
    require("../services/monitoringService");

const monitoringModel = require("../models/monitoringModel")

const testDailyMonitoring = async (req, res) => {
    try {
        const monitoring_date = req.query.date;
        if (!monitoring_date) {
            return res.status(400).send("Tanggal monitoring wajib diisi");
        }

        await monitoringService
            .createDailyMonitoringForAllUsers(
                monitoring_date
            );

        res.send(
            "Daily monitoring selesai dibuat"
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Error creating monitoring"
        );

    }
};

module.exports = {
    testDailyMonitoring
};