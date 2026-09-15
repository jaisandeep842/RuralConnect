import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Download, ExternalLink, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { Certificate } from '../types';
import { apiRequest } from '../api/client';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const CertificatesPage: React.FC = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await apiRequest('/api/certificates');
        setCertificates(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="brand">{t('certificates.title', 'Your Certificates')}</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Recognized Course Certificates
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            'certificates.subtitle',
            'Recognized certificates earned upon completing courses and training programs.'
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading certificates...')}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="max-w-md mx-auto text-center p-10 bg-white rounded-3xl border border-amber-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              'certificates.none',
              'No certificates earned yet. Complete a course to earn your first certificate!'
            )}
          </p>
          <div className="pt-2">
            <Link to="/learn">
              <Button variant="primary" size="md" className="flex items-center gap-2 mx-auto">
                <BookOpen className="w-4 h-4" />
                <span>Browse Learning Academy</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border-2 border-amber-200/90 p-6 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <Badge variant="verified">VERIFIED</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {cert.course_or_training_title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Awarded to <strong>{cert.user_name}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p className="text-slate-500">
                    Certificate ID: <span className="font-mono font-bold text-slate-900">{cert.certificate_number}</span>
                  </p>
                  <p className="text-slate-500">
                    Issued: <strong>{cert.issue_date}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1"
                >
                  {t('certificates.view', 'View Certificate')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCert(cert);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Print & Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          title="Official Certificate of Completion"
          maxWidth="lg"
        >
          <div className="border-8 border-double border-amber-700/60 p-8 text-center space-y-6 bg-amber-50/30 rounded-2xl print:border-4">
            <div className="space-y-1">
              <div className="w-14 h-14 bg-brand-700 rounded-full flex items-center justify-center text-white mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading uppercase tracking-wider mt-2">
                RuralConnect
              </h2>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
                Certificate of Achievement
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">This is to officially certify that</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading border-b-2 border-slate-300 pb-2 inline-block px-8">
                {selectedCert.user_name}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">
                has successfully completed all lectures, practical coursework, and requirements for
              </p>
              <h4 className="text-lg sm:text-xl font-bold text-brand-800">
                {selectedCert.course_or_training_title}
              </h4>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-4 border-t border-amber-200/80 text-left text-xs">
              <div>
                <p className="text-slate-400">Date Issued:</p>
                <p className="font-bold text-slate-800">{selectedCert.issue_date}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {selectedCert.certificate_number}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">Authorized Signatory:</p>
                <p className="font-bold text-slate-800">RuralConnect Advisory Board</p>
                <p className="text-[10px] text-brand-700 font-semibold">Digitally Verified Document</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 print:hidden">
              <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={handlePrint}>
                Print / Save PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
