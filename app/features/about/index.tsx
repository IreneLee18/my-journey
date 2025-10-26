import { Divider } from '@/components/customs/divider';
import { PageLayout } from '@/components/customs/pageLayout';

const titles: Record<string, { icon: string; title: string }> = {
  introduction: {
    icon: '👋',
    title: "Hi, I'm Irene Lee",
  },
  aboutProject: {
    icon: '💡',
    title: 'About This Project',
  },
  connect: {
    icon: '💬',
    title: "Let's Connect",
  },
};

const Title = ({ icon, title }: { icon: string; title: string }) => {
  return (
    <h2 className="lg:text-2xl md:text-xl text-lg font-semibold flex items-center gap-2">
      <span>{icon}</span>
      <span>{title}</span>
    </h2>
  );
};

export default function AboutPage() {
  return (
    <PageLayout title="About" className="flex flex-col gap-8">
      {/* Introduction Section */}
      <section className="space-y-4">
        <Title
          icon={titles.introduction.icon}
          title={titles.introduction.title}
        />
        <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            I'm a front-end engineer with 3+ years of experience, passionate
            about crafting reliable, elegant, and impactful digital experiences.
          </p>
          <p>
            I love bridging creativity and technology to deliver scalable
            solutions that not only work well but also feel great to use.
          </p>
        </div>
      </section>

      <Divider />

      {/* About Project Section */}
      <section className="space-y-4">
        <Title
          icon={titles.aboutProject.icon}
          title={titles.aboutProject.title}
        />
        <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            This project is something personal to me — a little digital space
            where I record my daily life, including thoughts, photos, and small
            moments that make each day unique.
          </p>
          <p className="font-medium">Why did I come up with this idea❓❗️</p>
          <p>
            Because I don't want to post on Instagram or Threads every day 😆
          </p>
          <p>
            Through this project, you'll get to enjoy a glimpse of my life ❤️
          </p>
        </div>
      </section>

      <Divider />

      {/* Connect Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <span>💬</span>
          <span>Let's Connect</span>
        </h2>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            If you're curious about this project or want to chat about front-end
            development, creativity, or digital life — feel free to reach out
            anytime ✨
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
