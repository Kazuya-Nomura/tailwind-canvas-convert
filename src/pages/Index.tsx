import BurningPaperTransition from "@/components/BurningPaperTransition";
import ScrollContent from "@/components/ScrollContent";

const Index = () => {
  return (
    <div className="relative min-h-[200vh] bg-background">
      <BurningPaperTransition />
      <ScrollContent />
    </div>
  );
};

export default Index;
