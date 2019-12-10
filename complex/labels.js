export function Labels(service) {
    return {
        app: service.name,
        tier: service.tier,
        region: service.region,
        environment: service.environment,
    };
}
