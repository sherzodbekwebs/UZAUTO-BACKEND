import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { HistoryModule } from './history/history.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { AffiliatedModule } from './affiliated/affiliated.module'
import { AnniversarySlidersModule } from './anniversary-sliders/anniversary-sliders.module';
import { DealersModule } from './dealers/dealers.module';
import { CatalogModule } from './catalog/catalog.module';
import { SlidersModule } from './sliders/sliders.module';
import { ManagementModule } from './management/management.module';
import { PartnersModule } from './partners/partners.module'
import { MenusModule } from './menus/menus.module';
import { PagesModule } from './pages/pages.module';
import { ClientsModule } from './clients/clients.module';
import { CrmModule } from './crm/crm.module';
import { SettingsModule } from './settings/settings.module'
import { AppealsModule } from './appeals/appeals.module';
import { DocumentsModule } from './documents/documents.module';
import { ProductsModule } from './products/products.module'
import { BrandsModule } from './brands/brands.module'
import { TechSectionsModule } from './tech-sections/tech-sections.module'
import { AdvantagesModule } from './advantages/advantages.module'
import { CategoriesModule } from './categories/categories.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminsModule } from './admins/admins.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ComplianceModule } from './compliance/compliance.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NewsModule,
    VacanciesModule,
    HistoryModule,
    SlidersModule,
    AppealsModule,
    AnniversarySlidersModule,
    CatalogModule,
    ManagementModule,
    PartnersModule,
    DocumentsModule,
    ProductsModule,
    CategoriesModule,
    AdvantagesModule,
    SettingsModule,
    ClientsModule,
    ComplianceModule,
    TechSectionsModule,
    DealersModule,
    AffiliatedModule,
    BrandsModule,
    CrmModule,
    MenusModule,
    PagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AdminsModule,
    DashboardModule,
  ],
})
export class AppModule { }