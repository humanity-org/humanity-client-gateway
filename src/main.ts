import { AppModule } from '@/app.module';
import { DefaultAppProvider } from '@/app.provider';
import { IConfigurationService } from '@/config/configuration.service.interface';

async function bootstrap(): Promise<void> {
  const app = await new DefaultAppProvider().provide(AppModule.register());

  const configurationService: IConfigurationService =
    app.get<IConfigurationService>(IConfigurationService);
  const applicationPort: string =
    configurationService.getOrThrow('application.port');

  if (configurationService.getOrThrow('application.allowCors')) {
    const corsOrigins = configurationService.getOrThrow<Array<string>>(
      'application.corsOrigins',
    );
    // Scope CORS to the configured frontend origin(s). With none configured,
    // reflect all origins (dev convenience). Staging/production set
    // CORS_ALLOWED_ORIGINS so the gateway only accepts the wallet UI origin.
    app.enableCors(
      corsOrigins.length > 0 ? { origin: corsOrigins } : undefined,
    );
  }

  await app.listen(applicationPort);
}

void bootstrap();
