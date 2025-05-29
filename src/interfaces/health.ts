export interface HealthCheck {
  status: string;
  timestamp: Date;
  responseTime: string;
  uptime: {
    server: string;
    since: Date;
  };
  environment: string | undefined;
  server: {
    nodeVersion: string;
    apiVersion: string;
    port: string | number;
    platform: string;
    arch: string;
  };
  system: {
    cpus: {
      count: number;
      model: string;
      speed: string;
    };
    loadAverage: number[];
    totalMemory: string;
    freeMemory: string;
  };
  performance: {
    memory: {
      heapUsed: string;
      heapTotal: string;
      rss: string;
      external: string;
    };
    requestCount: number;
    rateLimit: {
      windowMs: string | number;
      maxRequests: string | number;
    };
  };
  database: {
    status: string;
    uri?: string;
  };
}
