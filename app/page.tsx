import { InterviewProvider } from "@/lib/interview-context";
import { InterviewFlow } from "@/components/interview/interview-flow";

export default function Home() {
  return (
    <InterviewProvider>
      <InterviewFlow />
    </InterviewProvider>
  );
}
