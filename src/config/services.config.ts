const servicesConfig = Object.entries(process.env)
    .filter(([key]) => key.startsWith("SERVICE_") && key.endsWith("_URL"))
    .reduce<Record<string, string>>((acc, [key, value]) => {

      if (!value) {
        return acc;
      }

      const name = key
          .replace(/^SERVICE_/, "")
          .replace(/_URL$/, "")
          .toLowerCase() + 'Url';

      acc[name] = value;

      return acc;

    }, {});

export default servicesConfig;
