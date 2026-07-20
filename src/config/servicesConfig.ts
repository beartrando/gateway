export interface ServiceConfig {
    readonly url: string;
}

const servicesConfig = Object.entries(process.env)
    .filter(([key]) =>
        key.startsWith("SERVICE_") &&
        key.endsWith("_URL"),
    )
    .reduce<Record<string, ServiceConfig>>((acc, [key, value]) => {

        if (!value) {
            return acc;
        }

        const name = key
            .replace(/^SERVICE_/, "")
            .replace(/_URL$/, "")
            .toLowerCase();

        acc[name] = {
            url: value,
        };

        return acc;

    }, {});

export default Object.freeze(servicesConfig);