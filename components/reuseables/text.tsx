import { TextConfigurations } from "@/lib/configs/text-configs";

type TextVariant = keyof typeof TextConfigurations;

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  color?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  style?: React.CSSProperties;
}

// Reusable Text Component
export const Text: React.FC<TextProps> = ({
  variant = "RegularText",
  children,
  className = "",
  color,
  as: Component = "p",
  style = {},
}) => {
  const config = TextConfigurations[variant];

  // Determine the color to use
  const textColor =
    color || (config.color === "dynamic" ? undefined : config.color);

  // Build the style object
  const combinedStyle: React.CSSProperties = {
    fontSize: `${config.fontSize}px`,
    lineHeight: config.lineHeight,
    color: textColor,
    ...style,
  };

  // Combine class names
  const combinedClassName = `${config.fontWeight} ${className}`.trim();

  return (
    <Component style={combinedStyle} className={combinedClassName}>
      {children}
    </Component>
  );
};
