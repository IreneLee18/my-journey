import { Divider } from '@/components/customs/divider';
import { PageLayout } from '@/components/customs/pageLayout';
import { useTranslation } from '@/i18n/useTranslation';

const Title = ({ icon, title }: { icon: string; title: string }) => {
  return (
    <h2 className="lg:text-2xl md:text-xl text-lg font-semibold flex items-center gap-2">
      <span>{icon}</span>
      <span>{title}</span>
    </h2>
  );
};

export default function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <PageLayout title={t('about.page.title')} className="flex flex-col gap-8">
      {/* Introduction Section */}
      <section className="space-y-4">
        <Title
          icon="👋"
          title={t('about.introduction.title')}
        />
        <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{t('about.introduction.p1')}</p>
          <p>{t('about.introduction.p2')}</p>
        </div>
      </section>

      <Divider />

      {/* About Project Section */}
      <section className="space-y-4">
        <Title
          icon="💡"
          title={t('about.project.title')}
        />
        <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{t('about.project.p1')}</p>
          <p className="font-medium">{t('about.project.p2')}</p>
          <p>{t('about.project.p3')}</p>
          <p>{t('about.project.p4')}</p>
        </div>
      </section>

      <Divider />

      {/* Connect Section */}
      <section className="space-y-4">
        <Title
          icon="💬"
          title={t('about.connect.title')}
        />
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{t('about.connect.p1')}</p>
        </div>
      </section>
    </PageLayout>
  );
}
