import { useState } from "react";
import ToolIcon from "./ToolIcon";
import type { StudyTool } from "../lib/tools";

type Props = {
  tool: StudyTool;
  size?: number;
  className?: string;
};

/** Uses the real product artwork, with the local SVG icon as a reliable fallback. */
export default function ToolLogo({ tool, size = 30, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!tool.iconUrl || failed) {
    return <ToolIcon name={tool.icon} size={size} className={className} />;
  }

  return (
    <img
      className={className}
      src={tool.iconUrl}
      alt=""
      width={size}
      height={size}
      loading="eager"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}