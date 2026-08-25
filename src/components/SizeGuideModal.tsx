import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'tshirts' | 'hoodies' | 'pants'>('tshirts');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-brand" dir="ltr">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-black" />
            <span>Official ZYRO Size & Fit Guide</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-neutral-200 gap-2">
            <button
              onClick={() => setTab('tshirts')}
              className={`pb-2 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'tshirts' ? 'border-b-2 border-black text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => setTab('hoodies')}
              className={`pb-2 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'hoodies' ? 'border-b-2 border-black text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              Hoodies & Sweatshirts
            </button>
            <button
              onClick={() => setTab('pants')}
              className={`pb-2 px-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'pants' ? 'border-b-2 border-black text-black' : 'text-neutral-500 hover:text-black'
              }`}
            >
              Pants & Cargo
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {tab === 'tshirts' && (
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-neutral-800 uppercase tracking-wider">
                    <th className="p-2.5 border border-neutral-200">Size</th>
                    <th className="p-2.5 border border-neutral-200">Chest Width (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Length (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Recommended Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">S</td>
                    <td className="p-2.5 border border-neutral-200">54</td>
                    <td className="p-2.5 border border-neutral-200">70</td>
                    <td className="p-2.5 border border-neutral-200">50 - 65 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">M</td>
                    <td className="p-2.5 border border-neutral-200">57</td>
                    <td className="p-2.5 border border-neutral-200">73</td>
                    <td className="p-2.5 border border-neutral-200">65 - 75 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">L</td>
                    <td className="p-2.5 border border-neutral-200">60</td>
                    <td className="p-2.5 border border-neutral-200">76</td>
                    <td className="p-2.5 border border-neutral-200">75 - 85 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XL</td>
                    <td className="p-2.5 border border-neutral-200">63</td>
                    <td className="p-2.5 border border-neutral-200">79</td>
                    <td className="p-2.5 border border-neutral-200">85 - 98 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XXL</td>
                    <td className="p-2.5 border border-neutral-200">66</td>
                    <td className="p-2.5 border border-neutral-200">82</td>
                    <td className="p-2.5 border border-neutral-200">98 - 115 kg</td>
                  </tr>
                </tbody>
              </table>
            )}

            {tab === 'hoodies' && (
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-neutral-800 uppercase tracking-wider">
                    <th className="p-2.5 border border-neutral-200">Size</th>
                    <th className="p-2.5 border border-neutral-200">Chest Width (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Sleeve Length (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Total Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">M</td>
                    <td className="p-2.5 border border-neutral-200">60</td>
                    <td className="p-2.5 border border-neutral-200">62</td>
                    <td className="p-2.5 border border-neutral-200">72</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">L</td>
                    <td className="p-2.5 border border-neutral-200">63</td>
                    <td className="p-2.5 border border-neutral-200">64</td>
                    <td className="p-2.5 border border-neutral-200">75</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XL</td>
                    <td className="p-2.5 border border-neutral-200">66</td>
                    <td className="p-2.5 border border-neutral-200">66</td>
                    <td className="p-2.5 border border-neutral-200">78</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XXL</td>
                    <td className="p-2.5 border border-neutral-200">70</td>
                    <td className="p-2.5 border border-neutral-200">68</td>
                    <td className="p-2.5 border border-neutral-200">81</td>
                  </tr>
                </tbody>
              </table>
            )}

            {tab === 'pants' && (
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-100 font-bold text-neutral-800 uppercase tracking-wider">
                    <th className="p-2.5 border border-neutral-200">Size</th>
                    <th className="p-2.5 border border-neutral-200">Waist (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Length (cm)</th>
                    <th className="p-2.5 border border-neutral-200">Recommended Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">M</td>
                    <td className="p-2.5 border border-neutral-200">74 - 82</td>
                    <td className="p-2.5 border border-neutral-200">98</td>
                    <td className="p-2.5 border border-neutral-200">60 - 72 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">L</td>
                    <td className="p-2.5 border border-neutral-200">82 - 90</td>
                    <td className="p-2.5 border border-neutral-200">101</td>
                    <td className="p-2.5 border border-neutral-200">73 - 84 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XL</td>
                    <td className="p-2.5 border border-neutral-200">90 - 98</td>
                    <td className="p-2.5 border border-neutral-200">104</td>
                    <td className="p-2.5 border border-neutral-200">85 - 95 kg</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold border border-neutral-200">XXL</td>
                    <td className="p-2.5 border border-neutral-200">98 - 108</td>
                    <td className="p-2.5 border border-neutral-200">106</td>
                    <td className="p-2.5 border border-neutral-200">95 - 110 kg</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Advice Box */}
          <div className="bg-neutral-50 p-4 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-black uppercase tracking-wide">
              <HelpCircle className="w-4 h-4" />
              <span>Oversized Fit Recommendation:</span>
            </div>
            <p>
              All ZYRO designs are tailored with an authentic relaxed drop-shoulder cut. If you love the signature baggy streetwear look, order your standard size. If you prefer a closer, regular fit, we recommend ordering one size smaller.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white text-center">
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
