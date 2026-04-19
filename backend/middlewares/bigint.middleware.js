export const bigintMiddleware = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        const safeData = JSON.parse(
            JSON.stringify(data, (_, value) =>
                typeof value === 'bigint' ? value.toString() : value
            )
        );

        return originalJson.call(this, safeData);
    };

    next();
};