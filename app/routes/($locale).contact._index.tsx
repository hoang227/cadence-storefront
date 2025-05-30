import {Clock, Mail, MapPin} from 'lucide-react';
import {FormEvent, useState} from 'react';
import {ActionFunctionArgs} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

  // Submit actual form data to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {ok: true};
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type InquiryType = 'general' | 'bespoke';

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState<FormState>('idle');
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Handle form submission
      setFormStatus('success');
    } catch (e) {
      // Error in submitting
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/** Hero Section */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-2xl md:text-3xl text-white mb-6 ">
              Connect With Us
            </h1>
            <p className="font-source text-lg md:text-xl text-brand-cream max-w-2xl mx-auto">
              Whether you&apos;re interested in a private consultation, bespoke
              services, or have questions about our collection, we&apos;re here
              to assist you.
            </p>
          </div>
        </div>
      </section>

      {/** Contact Information Section */}
      <section className="py-16 px-4 bg-brand-cream">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white p-8">
              <MapPin className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Visit Us
              </h3>
              <p className="font-source text-brand-navy/70">
                123 Artisan Street
                <br />
                New York, NY 10001
                <br />
                United States
              </p>
            </div>
            <div className="text-center bg-white p-8">
              <Clock className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Atelier Hours
              </h3>
              <p className="font-source text-brand-navy/70">
                Monday - Friday
                <br />
                10:00 AM - 6:00 PM EST
                <br />
                Call any time
              </p>
            </div>
            <div className="text-center bg-white p-8">
              <Mail className="w-6 h-6 text-brand-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl mb-3 text-brand-navy">
                Contact
              </h3>
              <p className="font-source text-brand-navy/70">
                atelier@cadence.com
                <br />
                +1 (888) 123-4567
                <br />
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/** Contact Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            {/** Form Title */}
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl text-brand-navy mb-4">
                Get in Touch
              </h2>
              <p className="font-source text-brand-navy/70">
                We look forward to discussing how we can serve you
              </p>
            </div>

            {/** Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 ">
              {/** Inquiry Type */}
              <div className="grid grid-cols-2 gap-0">
                <button
                  type="button"
                  onClick={() => setInquiryType('general')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'general'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  General Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('bespoke')}
                  className={`p-4 text-center font-source transition-colors ${
                    inquiryType === 'bespoke'
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-cream text-brand-navy hover:bg-brand-navy/10'
                  }`}
                >
                  Bespoke Services
                </button>
              </div>

              {/** Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block font-source text-sm text-[#1A2A3A]/70 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    required
                    className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block font-source text-sm text-[#1A2A3A]/70 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    required
                    className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-source text-sm text-[#1A2A3A]/70 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  required
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block font-source text-sm text-[#1A2A3A]/70 mb-2"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-source text-sm text-[#1A2A3A]/70 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="w-full p-3 border border-[#1A2A3A]/20 focus:border-[#1A2A3A] outline-none transition-colors font-source"
                />
              </div>

              <button
                className="w-full bg-brand-navy text-white py-4 font-source tracking-wide hover:bg-brand-navyLight transition-colors disabled:bg-brand-navy/50"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <div className="text-brand-navy/70 text-center font-source">
                  Thank you for your message, we will be in touch shortly.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="text-red-600/70 text-center font-source">
                  There was an error sending your message, please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/** Bespoke Services Note */}
      <section className="py-16 px-4 bg-brand-cream">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-playfair text-2xl md:text-3xl text-brand-navy mb-4 ">
              Bespoke services
            </h3>
            <p className="font-source text-brand-navy/70">
              Our bespoke service offers a truly personalized experience—where
              every detail is tailored to you. From selecting the finest
              leathers to crafting a fit that feels like a second skin, our
              artisans work closely with you to bring your vision to life.
              Whether you&apos;re after a timeless classic or a one-of-a-kind
              design, each bespoke pair is meticulously hand-constructed to
              reflect your style, preferences, and individuality. It&apos;s not
              just custom footwear—it&apos;s a journey into craftsmanship and
              personal expression.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
