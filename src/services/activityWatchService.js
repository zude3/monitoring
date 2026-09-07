const activityWatchService = require("./activityWatchService");
const activityLogModel = require("../models/activityLogModel");

const ACTIVITY_WATCH_URL = "http://localhost:5600/api/0";

const getBuckets = async () => {
    const response = await fetch(
        `${ACTIVITY_WATCH_URL}/buckets`
    );

    if (!response.ok) {
        throw new Error(
            `ActivityWatch error: ${response.status}`
        );
    }

    return response.json();
};

const getWindowBucket = async () => {
    const buckets = await getBuckets();

    const bucket = Object.values(buckets).find(
        (bucket) => bucket.type === "currentwindow"
    );

    if (!bucket) {
        throw new Error(
            "ActivityWatch window bucket tidak ditemukan"
        );
    }

    return bucket;
};

const getAfkBucket = async () => {
    const buckets = await getBuckets();

    const bucket = Object.values(buckets).find(
        (bucket) => bucket.type === "afkstatus"
    );

    if (!bucket) {
        throw new Error(
            "ActivityWatch AFK bucket tidak ditemukan"
        );
    }

    return bucket;
};

const getWindowEvents = async () => {
    const bucket = await getWindowBucket();

    const response = await fetch(
        `${ACTIVITY_WATCH_URL}/buckets/${bucket.id}/events`
    );

    if (!response.ok) {
        throw new Error(
            `ActivityWatch API error: ${response.status}`
        );
    }

    const events = await response.json();

    return { bucket, events };
};

const getAfkEvents = async () => {
    const bucket = await getAfkBucket();

    const response = await fetch(
        `${ACTIVITY_WATCH_URL}/buckets/${bucket.id}/events`
    );

    if (!response.ok) {
        throw new Error(
            `ActivityWatch error: ${response.status}`
        );
    }

    const events = await response.json();

    return {
        bucket,
        events
    };
};

module.exports = {
    getBuckets,
    getWindowBucket,
    getWindowEvents,
    getAfkBucket,
    getAfkEvents
};