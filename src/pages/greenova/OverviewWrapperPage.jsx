import { useState } from 'react';
import { FarmerOverviewPage } from './FarmerOverviewPage';
import { LedgerPage } from './LedgerPage';
import { Activity, NotebookTabs } from 'lucide-react';

export function OverviewWrapperPage(props) {
  const [activeTab, setActiveTab] = useState('monitor');

  return (
    <div className="commerce-wrapper">
      <div className="commerce-tabs">
        <button 
          className={`commerce-tab ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          <Activity size={16} /> Giám sát IoT
        </button>
        <button 
          className={`commerce-tab ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          <NotebookTabs size={16} /> Nhật ký QR
        </button>
      </div>
      <div className="commerce-content">
        {activeTab === 'monitor' ? (
          <FarmerOverviewPage {...props} />
        ) : (
          <LedgerPage {...props} />
        )}
      </div>
    </div>
  );
}
