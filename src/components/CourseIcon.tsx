import {
  Globe,
  Sigma,
  Zap,
  FlaskConical,
  BarChart2,
  Leaf,
  Microscope,
  TestTube,
  Sprout,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Globe,
  Sigma,
  Zap,
  FlaskConical,
  BarChart2,
  Leaf,
  Microscope,
  TestTube,
  Sprout,
};

export function CourseIcon({
  name,
  size = 20,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const Icon = map[name] ?? Globe;
  return <Icon size={size} color={color} style={style} />;
}
