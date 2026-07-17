import React from 'react';
import Icon from '@components/common/Icon';

interface PartialDataNoticeProps {
  message: string;
}

const PartialDataNotice: React.FC<PartialDataNoticeProps> = ({ message }) => {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-md bg-warning-50 border border-warning-500/60 px-3 py-2 text-xs text-warning-800">
      <Icon name="warning" size={16} className="mt-0.5" />
      <p>{message}</p>
    </div>
  );
};

export default PartialDataNotice;
