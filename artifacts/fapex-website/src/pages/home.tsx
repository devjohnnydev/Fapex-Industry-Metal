import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Menu, X, Mail, MapPin, Phone,
  Leaf, ShieldCheck, Factory, Recycle, Scale,
  TrendingUp, CheckCircle2, ArrowRight, ChevronRight, Images,
  Sun, Moon, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { apiJson } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
}
interface GalleryPhoto {
  id: number;
  title: string;
  imageUrl: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return ""; }
}

interface ServiceDetail {
  icon: React.ElementType;
  title: string;
  desc: string;
  longDesc: string;
  highlights: string[];
  cta: string;
}

const serviceDetails: ServiceDetail[] = [
  {
    icon: Scale,
    title: "Compra e Venda",
    desc: "Comercialização em grande escala de sucatas metálicas ferrosas e não-ferrosas com as melhores condições de mercado.",
    longDesc: "Somos referência nacional na comercialização de sucatas metálicas, atuando com total transparência e agilidade. Trabalhamos com grandes volumes e oferecemos as melhores cotações do mercado, sempre alinhadas com os preços das bolsas internacionais.",
    highlights: [
      "Compra de ferro, aço, alumínio, cobre e ligas especiais",
      "Cotação imediata e pagamento no prazo combinado",
      "Logística própria para coleta em todo o território nacional",
      "Pesagem certificada e rastreabilidade completa",
      "Contratos de fornecimento de longo prazo",
    ],
    cta: "Solicitar Cotação",
  },
  {
    icon: Recycle,
    title: "Gestão e Destinação",
    desc: "Coleta, transporte e destinação ambientalmente correta de resíduos industriais com emissão de certificados CADRI e CDF.",
    longDesc: "Oferecemos uma solução completa para a gestão de resíduos industriais, garantindo conformidade com a legislação ambiental vigente. Nossa equipe técnica acompanha todo o processo, desde a coleta até a emissão da documentação legal.",
    highlights: [
      "Emissão de CADRI (Certificado de Aprovação de Destinação de Resíduos Industriais)",
      "CDF (Certificado de Destinação Final) para todos os materiais",
      "Transporte licenciado e veículos rastreados",
      "Plano de Gerenciamento de Resíduos Sólidos (PGRS)",
      "Conformidade com a PNRS (Política Nacional de Resíduos Sólidos)",
    ],
    cta: "Falar com Especialista",
  },
  {
    icon: TrendingUp,
    title: "Assessoria",
    desc: "Consultoria especializada para empresas no gerenciamento inteligente de resíduos e passivos com total conformidade legal.",
    longDesc: "Nossa assessoria técnica e ambiental ajuda sua empresa a transformar o gerenciamento de resíduos em uma vantagem competitiva. Desenvolvemos soluções personalizadas que reduzem custos, garantem conformidade legal e geram valor ao negócio.",
    highlights: [
      "Diagnóstico completo do passivo ambiental da empresa",
      "Elaboração e implementação do PGRS",
      "Treinamento das equipes internas",
      "Acompanhamento de auditorias e fiscalizações",
      "Relatórios de sustentabilidade e ESG",
    ],
    cta: "Agendar Diagnóstico",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    apiJson<BlogPost[]>("/blog-posts").then(setBlogPosts).catch(() => {});
    apiJson<GalleryPhoto[]>("/gallery").then(setGalleryPhotos).catch(() => {});
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mensagem enviada!", description: "Nossa equipe entrará em contato em breve." });
    (e.target as HTMLFormElement).reset();
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Sobre", id: "sobre" },
    { name: "Serviços", id: "servicos" },
    { name: "Materiais", id: "materiais" },
    { name: "Blog", id: "blog" },
    { name: "Galeria", id: "galeria" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ── NAVIGATION ── */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#111]/95 dark:bg-[#0a0a0a]/98 backdrop-blur-md py-1 shadow-lg"
          : "bg-transparent py-2"
      }`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src="/fapex-logo-nobg.png" alt="Fapex" style={{ height: "110px", width: "auto" }} />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)}
                className="text-sm font-semibold text-white/80 hover:text-green-400 transition-colors uppercase tracking-wider">
                {link.name}
              </button>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Alternar tema"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button onClick={() => scrollToSection("contato")}
              className="bg-green-600 hover:bg-green-500 text-white rounded-none px-6 font-bold tracking-wide">
              Fale Conosco
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#111] dark:bg-[#0a0a0a] pt-24 px-6 pb-6 flex flex-col">
            <div className="flex flex-col space-y-5 text-center mt-8">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className="text-xl font-semibold text-white hover:text-green-400 transition-colors uppercase tracking-wider">
                  {link.name}
                </button>
              ))}
              <Button onClick={() => scrollToSection("contato")} size="lg"
                className="mt-4 bg-green-600 hover:bg-green-500 text-white rounded-none w-full font-bold">
                Fale Conosco
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO (always dark) ── */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden bg-[#0a0a0a]">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/60 to-[#0a0a0a] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/85 to-transparent z-10" />
          <img src="/images/hero-bg.png" alt="Fapex" className="w-full h-full object-cover object-center" />
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-20 pt-36 md:pt-32">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.h1 variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
              FORÇA<br />
              <span className="text-green-400">INDUSTRIAL.</span><br />
              <span className="text-green-400">IMPACTO</span><br />
              <span className="text-white">AMBIENTAL.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              Líder na compra, venda e gestão de sucatas metálicas e resíduos industriais.
              Transformamos passivos em economia circular com total conformidade legal.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => scrollToSection("contato")} size="lg"
                className="bg-green-600 hover:bg-green-500 text-white h-14 px-8 text-base rounded-none font-bold tracking-wide group">
                SOLICITAR COTAÇÃO
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={() => scrollToSection("sobre")} size="lg" variant="outline"
                className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base rounded-none font-bold tracking-wide">
                CONHEÇA A FAPEX
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => scrollToSection("sobre")}>
          <span className="text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Rolar</span>
          <div className="w-[1px] h-14 bg-white/20 relative overflow-hidden">
            <motion.div className="absolute top-0 left-0 w-full h-1/2 bg-green-400"
              animate={{ top: ["-50%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </div>
        </motion.div>
      </section>

      {/* ── MATERIAIS BANNER ── */}
      <div className="bg-green-700 dark:bg-green-800 py-4">
        <div className="container mx-auto px-6 md:px-12">
          <p className="text-white text-sm font-medium text-center">
            <span className="font-bold">Compramos e vendemos:</span>
            {" "}Aço · Ferro · Cobre · Alumínio · Latão · Bronze · Zinco · Aço Inox · Resíduos Industriais
          </p>
        </div>
      </div>

      {/* ── SOBRE NÓS ── */}
      <section id="sobre" className="py-20 md:py-28 bg-white dark:bg-gray-950 transition-colors">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <div className="h-[3px] w-10 bg-green-600" />
                <span className="text-green-700 dark:text-green-400 font-semibold tracking-widest uppercase text-sm">Sobre a Fapex</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                Experiência e solidez no mercado de <span className="text-green-600 dark:text-green-400">reciclagem</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-300 text-lg mb-5 leading-relaxed">
                A <strong>Fapex Indústria e Comércio de Resíduos e Metais</strong> atua há anos no mercado oferecendo soluções integradas para a gestão de passivos industriais.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                Somos parceiros estratégicos de grandes indústrias, garantindo que materiais recicláveis retornem à cadeia produtiva de forma eficiente, rentável e ambientalmente responsável.
              </motion.p>
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-800 pt-8">
                {[
                  { n: "100%", label: "Conformidade Legal" },
                  { n: "+10k", label: "Ton. Processadas" },
                  { n: "CNPJ", label: "60.147.676/0001-34" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-black text-green-600 dark:text-green-400 mb-1">{s.n}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative h-[460px]">
              <div className="absolute inset-0 bg-green-600/10 translate-x-3 translate-y-3 rounded" />
              <img src="/images/about-facility.png" alt="Fapex" className="absolute inset-0 w-full h-full object-cover rounded shadow-xl" />
              <div className="absolute bottom-0 left-0 bg-green-700 p-5 w-3/4 rounded-tr">
                <p className="text-white font-semibold text-sm leading-snug">
                  "Estrutura completa e equipe especializada para qualquer volume de sucata."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="servicos" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[3px] w-10 bg-green-600" />
              <span className="text-green-700 dark:text-green-400 font-semibold tracking-widest uppercase text-sm">O que fazemos</span>
              <div className="h-[3px] w-10 bg-green-600" />
            </motion.div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Soluções completas em <span className="text-green-600 dark:text-green-400">gestão de resíduos</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceDetails.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } } }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 hover:border-green-500 hover:shadow-lg transition-all group rounded-sm cursor-pointer"
                  onClick={() => setSelectedService(svc)}>
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg w-fit mb-5 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                    <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{svc.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{svc.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>Saiba mais</span><ChevronRight className="h-4 w-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MATERIAIS ── */}
      <section id="materiais" className="py-20 md:py-28 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
              className="relative h-[480px] order-2 lg:order-1">
              <img src="/images/materials.png" alt="Materiais" className="w-full h-full object-cover rounded shadow-xl" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}
              className="order-1 lg:order-2">
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <div className="h-[3px] w-10 bg-green-600" />
                <span className="text-green-700 dark:text-green-400 font-semibold tracking-widest uppercase text-sm">Materiais que compramos</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                Ampla variedade de <span className="text-green-600 dark:text-green-400">sucatas industriais</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed">
                Classificamos e processamos materiais para reintegração na indústria siderúrgica e metalúrgica com total rastreabilidade e melhores preços.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <motion.div variants={fadeInUp}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b-2 border-green-500 inline-block">Metais Ferrosos</h3>
                  <ul className="space-y-2 mt-3">
                    {["Aço", "Ferro Fundido", "Aço Inox", "Estamparia"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b-2 border-green-500 inline-block">Metais Não-Ferrosos</h3>
                  <ul className="space-y-2 mt-3">
                    {["Cobre", "Alumínio", "Latão", "Bronze", "Zinco", "Chumbo"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp}
                className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded text-sm text-amber-800 dark:text-amber-300">
                <strong>Não trabalhamos com:</strong> Papelão, madeira, vidro, plástico, eletrodoméstico e sucata automotiva.
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SUSTENTABILIDADE (always dark green) ── */}
      <section id="sustentabilidade" className="py-20 md:py-28 bg-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/sustainability.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="flex justify-center mb-4">
                <Leaf className="text-green-300 h-10 w-10" />
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Compromisso com o <span className="text-green-300">futuro</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-white/75 mb-12 leading-relaxed">
                A reciclagem de metais reduz em até <strong className="text-green-300">90%</strong> a extração de minérios.
                Na Fapex, a sustentabilidade não é marketing — é o nosso modelo de negócio.
              </motion.p>
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: ShieldCheck, title: "Rastreabilidade", desc: "Controle total desde a coleta até a destinação final com total transparência." },
                  { icon: Factory, title: "Certificação", desc: "Emissão de CADRI e CDF, garantindo conformidade ambiental para sua empresa." },
                  { icon: Recycle, title: "Zero Desperdício", desc: "Foco na valorização e reaproveitamento de 100% dos materiais recebidos." },
                ].map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} variants={fadeInUp}
                    className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded text-left">
                    <Icon className="h-7 w-7 text-green-300 mb-3" />
                    <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
                    <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog" className="py-20 md:py-28 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[3px] w-10 bg-green-600" />
                <span className="text-green-700 dark:text-green-400 font-semibold tracking-widest uppercase text-sm">Notícias</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Blog Fapex</h2>
            </div>
          </div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <p className="text-lg">Em breve publicaremos conteúdo sobre reciclagem e metais.</p>
              <p className="text-sm mt-2">Acompanhe nossas novidades!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 6).map((post, i) => (
                <motion.article key={post.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
                  className="group border border-gray-200 dark:border-gray-800 rounded overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900 transition-all bg-white dark:bg-gray-900">
                  <div className="overflow-hidden h-48 bg-gray-100 dark:bg-gray-800">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <Factory className="h-12 w-12 text-green-200 dark:text-green-800" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.publishedAt && (
                      <p className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GALERIA ── */}
      {galleryPhotos.length > 0 && (
        <section id="galeria" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[3px] w-10 bg-green-600" />
                  <span className="text-green-700 dark:text-green-400 font-semibold tracking-widest uppercase text-sm">Instalações</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Galeria de Fotos</h2>
              </div>
              <Images className="h-8 w-8 text-green-500 opacity-30" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryPhotos.slice(0, 8).map((photo, i) => (
                <motion.div key={photo.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.06, duration: 0.4 } } }}
                  className="group relative overflow-hidden rounded aspect-square bg-gray-200 dark:bg-gray-800">
                  <img src={photo.imageUrl} alt={photo.title || "Fapex"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {photo.title && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-sm font-medium">{photo.title}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTATO ── */}
      <section id="contato" className="py-20 md:py-28 bg-[#111] dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <div className="h-[3px] w-10 bg-green-500" />
                <span className="text-green-400 font-semibold tracking-widest uppercase text-sm">Entre em Contato</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Vamos fazer <span className="text-green-400">negócio.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg">
                Seja para vender suas sucatas ou estruturar um plano de gestão de resíduos,
                nossa equipe está pronta para atender sua indústria.
              </motion.p>

              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "Localização", value: "São Paulo, SP - Brasil" },
                  { icon: Phone, label: "Telefone", value: "(11) 0000-0000" },
                  { icon: Mail, label: "E-mail", value: "contato@fapex.com.br" },
                ].map(({ icon: Icon, label, value }) => (
                  <motion.div key={label} variants={fadeInUp} className="flex items-center gap-5">
                    <div className="p-3 bg-green-600/20 rounded-lg shrink-0">
                      <Icon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-0.5">{label}</p>
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="mt-10 p-4 border border-white/10 rounded">
                <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">CNPJ</p>
                <p className="text-white/70 font-mono">60.147.676/0001-34</p>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <form onSubmit={handleContactSubmit}
                className="space-y-4 bg-white/5 border border-white/10 rounded-lg p-8">
                <h3 className="text-white font-bold text-xl mb-6">Envie uma mensagem</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm mb-1 block">Nome *</Label>
                    <Input required placeholder="Seu nome"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-1 block">Empresa</Label>
                    <Input placeholder="Empresa (opcional)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm mb-1 block">E-mail *</Label>
                    <Input required type="email" placeholder="email@empresa.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-1 block">Telefone</Label>
                    <Input placeholder="(11) 00000-0000"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none" />
                  </div>
                </div>
                <div>
                  <Label className="text-white/60 text-sm mb-1 block">Mensagem *</Label>
                  <Textarea required rows={5} placeholder="Descreva o material, volume estimado..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none resize-none" />
                </div>
                <Button type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white rounded-none h-12 font-bold tracking-wide">
                  ENVIAR MENSAGEM
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] py-12 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-24 mb-4" />
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Soluções inteligentes e sustentáveis para o comércio de resíduos e metais industriais.
              </p>
              <p className="text-white/25 text-xs mt-3 font-mono">CNPJ 60.147.676/0001-34</p>
            </div>
            <div>
              <h4 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-white/35 text-sm">
                {["Compra de Sucata", "Venda de Metais", "Gestão de Resíduos", "Assessoria"].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-white/35 text-sm">
                <li>São Paulo, SP</li>
                <li>contato@fapex.com.br</li>
                <li>(11) 0000-0000</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/20 text-xs">
              &copy; {new Date().getFullYear()} Fapex Indústria e Comércio de Resíduos e Metais LTDA. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="text-white/20 text-xs hover:text-white/50 transition-colors flex items-center gap-1.5">
                {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
              <a href="/admin" title="Área Administrativa" className="text-white/20 hover:text-white/50 transition-colors">
                <Settings className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SERVICE MODAL ── */}
      <AnimatePresence>
        {selectedService && (() => {
          const Icon = selectedService.icon;
          return (
            <motion.div
              key="service-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedService(null)}
            >
              {/* Backdrop blur */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

              <motion.div
                key="service-modal-card"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="relative z-10 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glass card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
                  {/* Green gradient top bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600" />

                  <div className="p-8">
                    {/* Close button */}
                    <button
                      onClick={() => setSelectedService(null)}
                      className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Icon + title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3.5 bg-green-500/20 rounded-xl border border-green-400/30">
                        <Icon className="h-7 w-7 text-green-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">{selectedService.title}</h2>
                    </div>

                    {/* Long description */}
                    <p className="text-white/75 leading-relaxed mb-7 text-sm">
                      {selectedService.longDesc}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2.5 mb-8">
                      {selectedService.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                          </div>
                          <span className="text-white/80 text-sm leading-snug">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                    >
                      {selectedService.cta} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5511983522274?text=Olá%2C%20gostaria%20de%20solicitar%20uma%20cotação%20para%20os%20serviços%20da%20Fapex%20Comércio%20de%20Resíduos%20e%20Metais."
        target="_blank"
        rel="noreferrer"
        aria-label="Fale pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-800 text-sm font-semibold px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
          Fale Conosco
        </span>
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] transition-all hover:scale-110 active:scale-95 shadow-xl">
          <span className="absolute inline-flex w-full h-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
          <svg viewBox="0 0 32 32" className="relative w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.002 2C8.269 2 2 8.268 2 16c0 2.49.651 4.823 1.79 6.845L2 30l7.343-1.766A13.94 13.94 0 0 0 16.002 30C23.733 30 30 23.731 30 16S23.733 2 16.002 2zm0 25.538a11.52 11.52 0 0 1-5.876-1.607l-.42-.25-4.356 1.048 1.077-4.24-.274-.435A11.498 11.498 0 0 1 4.462 16c0-6.36 5.18-11.538 11.54-11.538S27.538 9.64 27.538 16s-5.177 11.538-11.536 11.538zm6.33-8.636c-.347-.174-2.055-1.013-2.374-1.129-.319-.116-.55-.174-.782.174-.231.347-.896 1.129-1.099 1.36-.202.232-.404.26-.751.087-.347-.174-1.465-.54-2.79-1.72-1.031-.92-1.727-2.055-1.93-2.402-.202-.347-.022-.535.152-.707.156-.155.347-.405.52-.607.174-.202.232-.347.347-.579.116-.231.058-.434-.029-.607-.087-.174-.782-1.884-1.071-2.58-.282-.678-.569-.586-.782-.597l-.666-.011a1.278 1.278 0 0 0-.925.434c-.318.347-1.214 1.186-1.214 2.893s1.243 3.355 1.417 3.587c.174.231 2.447 3.733 5.929 5.235.829.358 1.476.572 1.98.732.832.265 1.59.228 2.189.138.667-.1 2.055-.84 2.345-1.651.289-.811.289-1.506.202-1.651-.086-.145-.318-.232-.665-.405z"/>
          </svg>
        </div>
      </a>
    </div>
  );
}
