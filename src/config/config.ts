export const config = {
    grpcPort: Number(process.env.GRPC_PORT) || 50051,
    httpPort: Number(process.env.HTTP_PORT) || 9090,
};

export default config;
