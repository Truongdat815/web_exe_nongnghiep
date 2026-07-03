import { useState } from 'react';
import { MarketplacePage } from './MarketplacePage';
import { ProduceMarketPage } from './ProduceMarketPage';
import { ShoppingCart, Store } from 'lucide-react';

export function CommerceWrapperPage(props) {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="commerce-wrapper">
      <div className="commerce-tabs">
        <button 
          className={`commerce-tab ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          <ShoppingCart size={16} /> Mua vật tư
        </button>
        <button 
          className={`commerce-tab ${activeTab === 'sell' ? 'active' : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          <Store size={16} /> Bán nông sản
        </button>
      </div>
      <div className="commerce-content">
        {activeTab === 'buy' ? <MarketplacePage {...props} /> : <ProduceMarketPage {...props} />}
      </div>
    </div>
  );
}
