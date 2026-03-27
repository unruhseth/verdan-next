export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: March 27, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Verdan.io LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our website at Verdan.io and our pond and water management automation services
              (collectively, the &quot;Services&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and account
                credentials provided during registration.
              </li>
              <li>
                <strong>Device and Telemetry Data:</strong> Water level readings, valve positions, sensor
                measurements, device connectivity status, fault events, and other operational data collected
                from your connected hardware devices.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our website and
                dashboards, including IP addresses, browser type, and access times.
              </li>
              <li>
                <strong>Communication Data:</strong> Phone numbers provided for SMS alert services,
                message delivery status, and opt-in/opt-out preferences.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Provide, operate, and maintain our Services</li>
              <li>Send SMS text message alerts about device status, faults, and water level conditions</li>
              <li>Monitor and improve the performance of your connected devices</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send administrative communications about your account</li>
              <li>Detect, prevent, and address technical issues or security concerns</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. SMS Data and Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you opt in to receive SMS notifications:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>We collect and store your phone number solely for the purpose of sending service-related alerts.</li>
              <li>We do not sell, rent, or share your phone number with third parties for marketing purposes.</li>
              <li>We use Twilio, a third-party service provider, to deliver SMS messages. Twilio processes
                your phone number in accordance with their own privacy policy.</li>
              <li>You may opt out at any time by replying <strong>STOP</strong> to any message.</li>
              <li>Message and data rates may apply. Message frequency varies.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information only in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Service Providers:</strong> With trusted third-party vendors (e.g., Twilio for SMS,
                cloud hosting providers) who assist in operating our Services, subject to confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
              <li><strong>Safety:</strong> To protect the rights, property, or safety of Verdan.io LLC,
                our users, or the public.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement reasonable technical and organizational measures to protect your information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet or electronic storage is completely secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to
              provide you with our Services. Device telemetry data may be retained for historical reporting
              and analysis purposes. You may request deletion of your account and associated data by
              contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You may request access to, correction of, or deletion of your personal information at any
              time by contacting us at{" "}
              <a href="mailto:support@verdan.io" className="text-blue-600 hover:underline">support@verdan.io</a>.
              You may also opt out of SMS communications by replying <strong>STOP</strong> to any text message.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by updating the date at the top of this page. Your continued use of the Services
              after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@verdan.io" className="text-blue-600 hover:underline">support@verdan.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
