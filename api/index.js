export default async function handler(req, res) {
    const { default: app } = await import("../server/server.js");
    return app(req, res);
}