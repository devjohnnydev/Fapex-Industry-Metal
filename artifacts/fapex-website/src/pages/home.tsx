import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Menu, X, ChevronRight, Phone, Mail, MapPin, 
  Leaf, ShieldCheck, Factory, Recycle, Scale, 
  TrendingUp, Truck, CheckCircle2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada",
      description: "Nossa equipe entrará em contato em breve.",
    });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { name: "Sobre", id: "sobre" },
    { name: "Serviços", id: "servicos" },
    { name: "Materiais", id: "materiais" },
    { name: "Sustentabilidade", id: "sustentabilidade" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
          isScrolled ? "bg-background/90 backdrop-blur-md border-border/50 py-4 shadow-sm" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
            <img src="/fapex-logo-nobg.png" alt="Fapex Logo" className="h-16 md:h-20 w-auto" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollToSection("contato")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6">
              Fale Conosco
            </Button>
          </div>

          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col"
          >
            <div className="flex flex-col space-y-6 text-center mt-12">
              {navLinks.map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => scrollToSection(link.id)}
                  className="text-xl font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wider"
                >
                  {link.name}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection("contato")} 
                size="lg"
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none w-full"
              >
                Fale Conosco
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent z-10" />
          <img 
            src="/images/hero-bg.png" 
            alt="Fapex Industrial Facility" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-6"
            >
              FORÇA INDUSTRIAL.<br />
              <span className="text-primary">IMPACTO AMBIENTAL.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10 leading-relaxed"
            >
              Líder na compra, venda e gestão de sucatas metálicas e resíduos industriais. 
              Transformamos passivos em economia circular com total conformidade legal.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => scrollToSection("contato")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base rounded-none font-bold tracking-wide group">
                SOLICITAR COTAÇÃO
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={() => scrollToSection("sobre")} size="lg" variant="outline" className="border-border hover:bg-secondary h-14 px-8 text-base rounded-none font-bold tracking-wide">
                CONHEÇA A FAPEX
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => scrollToSection("sobre")}
        >
          <span className="text-xs text-foreground/50 uppercase tracking-widest mb-2 font-medium">Rolar</span>
          <div className="w-[1px] h-16 bg-border relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-primary"
              animate={{ top: ["-50%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="py-24 md:py-32 bg-background relative border-t border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="flex items-center space-x-3 mb-6">
                <ShieldCheck className="text-primary h-6 w-6" />
                <span className="text-primary font-semibold tracking-widest uppercase text-sm">Nossa História</span>
              </motion.div>
              
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                EXPERIÊNCIA E SOLIDEZ NO MERCADO DE <span className="text-primary">RECICLAGEM</span>
              </motion.h2>
              
              <motion.p variants={fadeInUp} className="text-foreground/70 text-lg mb-6 leading-relaxed">
                A Fapex Indústria e Comércio de Resíduos e Metais atua há anos no mercado oferecendo soluções integradas para a gestão de passivos industriais.
              </motion.p>
              
              <motion.p variants={fadeInUp} className="text-foreground/70 text-lg mb-10 leading-relaxed">
                Somos parceiros estratégicos de grandes indústrias, garantindo que materiais recicláveis retornem à cadeia produtiva de forma eficiente, rentável e ambientalmente responsável, com total rastreabilidade.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">100%</h4>
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">Conformidade Legal</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">+10k</h4>
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-medium">Ton. Processadas</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative h-[600px] w-full"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-4 translate-y-4 z-0"></div>
              <img 
                src="/images/about-facility.png" 
                alt="Fapex Operations" 
                className="absolute inset-0 w-full h-full object-cover z-10 grayscale-[30%] contrast-125"
              />
              <div className="absolute bottom-0 left-0 bg-background border-t-2 border-r-2 border-primary p-6 z-20 w-3/4">
                <p className="text-lg font-bold leading-tight">
                  "Estrutura completa e equipe especializada para o processamento de qualquer volume de sucata."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-24 md:py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <Factory className="text-primary h-6 w-6" />
              <span className="text-primary font-semibold tracking-widest uppercase text-sm">O Que Fazemos</span>
            </motion.div>
            
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              SOLUÇÕES COMPLETAS EM <span className="text-primary">GESTÃO DE RESÍDUOS</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scale className="h-10 w-10 text-primary mb-6" />,
                title: "Compra e Venda",
                desc: "Comercialização em grande escala de sucatas metálicas ferrosas e não-ferrosas com as melhores condições de mercado."
              },
              {
                icon: <Recycle className="h-10 w-10 text-primary mb-6" />,
                title: "Gestão e Destinação",
                desc: "Coleta, transporte e destinação ambientalmente correta de resíduos industriais com emissão de certificados."
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-primary mb-6" />,
                title: "Assessoria",
                desc: "Consultoria especializada para empresas no gerenciamento inteligente de seus resíduos e passivos."
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1, duration: 0.5 } }
                }}
                className="bg-background border border-border p-10 hover:border-primary/50 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {service.icon}
                </div>
                <div className="relative z-10">
                  {service.icon}
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{service.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materiais */}
      <section id="materiais" className="py-24 md:py-32 bg-background border-y border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  MATERIAIS QUE <span className="text-primary">PROCESSAMOS</span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-foreground/70 text-lg mb-8 leading-relaxed">
                  Trabalhamos com uma ampla variedade de sucatas industriais, classificando e processando materiais para reintegração na indústria siderúrgica e metalúrgica.
                </motion.p>

                <div className="space-y-8">
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-xl font-bold mb-4 text-white border-b border-border pb-2 inline-block">Metais Ferrosos</h3>
                    <ul className="space-y-3">
                      {['Aço', 'Ferro Fundido', 'Aço Inox', 'Estamparia'].map((item, i) => (
                        <li key={i} className="flex items-center text-foreground/80">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-3" />
                          <span className="text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-xl font-bold mb-4 text-white border-b border-border pb-2 inline-block">Metais Não-Ferrosos</h3>
                    <ul className="grid grid-cols-2 gap-3">
                      {['Cobre', 'Alumínio', 'Latão', 'Bronze', 'Zinco', 'Chumbo'].map((item, i) => (
                        <li key={i} className="flex items-center text-foreground/80">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-3" />
                          <span className="text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-7">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                className="h-full min-h-[500px] w-full relative"
              >
                <img 
                  src="/images/materials.png" 
                  alt="Materiais Metálicos" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustentabilidade */}
      <section id="sustentabilidade" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/sustainability.png" 
            alt="Sustentabilidade" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/90 z-10"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-3 mb-6">
                <Leaf className="text-primary h-8 w-8" />
              </motion.div>
              
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                COMPROMISSO COM O <span className="text-primary">FUTURO</span>
              </motion.h2>
              
              <motion.p variants={fadeInUp} className="text-xl text-foreground/80 mb-12 leading-relaxed">
                A reciclagem de metais reduz em até 90% a extração de minérios e economiza quantidades massivas de energia. Na Fapex, a sustentabilidade não é marketing, é o nosso modelo de negócio. 
                Cada tonelada processada por nós é uma vitória para a economia circular.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-secondary/50 border border-border p-6 backdrop-blur-sm">
                  <h4 className="text-xl font-bold mb-2 text-white">Rastreabilidade</h4>
                  <p className="text-foreground/70">Controle total desde a coleta até a destinação final, garantindo transparência.</p>
                </div>
                <div className="bg-secondary/50 border border-border p-6 backdrop-blur-sm">
                  <h4 className="text-xl font-bold mb-2 text-white">Certificação</h4>
                  <p className="text-foreground/70">Emissão de CADRI e CDF, assegurando que sua empresa atenda todas as normas.</p>
                </div>
                <div className="bg-secondary/50 border border-border p-6 backdrop-blur-sm">
                  <h4 className="text-xl font-bold mb-2 text-white">Zero Desperdício</h4>
                  <p className="text-foreground/70">Foco máximo na valorização e reaproveitamento de 100% dos materiais recebidos.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-24 md:py-32 bg-background border-t border-border">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                VAMOS FAZER <span className="text-primary">NEGÓCIO.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-foreground/70 text-lg mb-10 leading-relaxed max-w-lg">
                Seja para vender suas sucatas ou estruturar um plano de gestão de resíduos, nossa equipe está pronta para atender sua indústria.
              </motion.p>

              <div className="space-y-8">
                <motion.div variants={fadeInUp} className="flex items-start">
                  <div className="bg-secondary p-4 mr-6">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm text-foreground/50 uppercase tracking-widest font-bold mb-1">Localização</h4>
                    <p className="text-lg font-medium text-white">São Paulo, SP - Brasil</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start">
                  <div className="bg-secondary p-4 mr-6">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm text-foreground/50 uppercase tracking-widest font-bold mb-1">Telefone</h4>
                    <p className="text-lg font-medium text-white">(11) 0000-0000</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex items-start">
                  <div className="bg-secondary p-4 mr-6">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm text-foreground/50 uppercase tracking-widest font-bold mb-1">E-mail</h4>
                    <p className="text-lg font-medium text-white">contato@fapex.com.br</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="pt-6 border-t border-border mt-6">
                  <p className="text-sm text-foreground/60 font-mono">CNPJ: 60.147.676/0001-34</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-secondary/40 border border-border p-8 md:p-12"
            >
              <h3 className="text-2xl font-bold mb-8">Solicite um Orçamento</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" required className="bg-background border-border h-12 rounded-none focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input id="empresa" required className="bg-background border-border h-12 rounded-none focus-visible:ring-primary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Corporativo</Label>
                    <Input id="email" type="email" required className="bg-background border-border h-12 rounded-none focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                    <Input id="telefone" required className="bg-background border-border h-12 rounded-none focus-visible:ring-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Como podemos ajudar?</Label>
                  <Textarea id="mensagem" required className="bg-background border-border min-h-[120px] rounded-none focus-visible:ring-primary resize-y" />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base rounded-none font-bold tracking-widest uppercase">
                  ENVIAR MENSAGEM
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-16 border-t border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img src="/fapex-logo-nobg.png" alt="Fapex" className="h-16 mb-6" />
              <p className="text-foreground/60 max-w-sm">
                Soluções inteligentes e sustentáveis para o comércio de resíduos e metais industriais. Transformando passivos em ativos na economia circular.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Links Rápidos</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => scrollToSection(link.id)}
                      className="text-foreground/60 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Legal</h4>
              <ul className="space-y-3 text-foreground/60 text-sm">
                <li>CNPJ: 60.147.676/0001-34</li>
                <li>Licenças Ambientais</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-foreground/50">
            <p>&copy; {new Date().getFullYear()} Fapex Indústria e Comércio de Resíduos e Metais LTDA. Todos os direitos reservados.</p>
            <p className="mt-4 md:mt-0">Desenvolvido com excelência.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
