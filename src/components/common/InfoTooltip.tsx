import { FC, ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface InfoTooltipProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export const InfoTooltip: FC<InfoTooltipProps> = ({ title, description, icon }) => {
  const content = description ? (
    <div className="flex flex-col gap-1 max-w-xs">
      <span className="font-medium">{title}</span>
      <span className="text-xs text-text-secondary">{description}</span>
    </div>
  ) : (
    <span>{title}</span>
  );

  return (
    <Tooltip title={content} arrow>
      <IconButton size="small" aria-label={title} className="text-text-secondary">
        {icon ?? <InfoOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};
