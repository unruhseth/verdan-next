export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: March 27, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the services provided by Verdan.io LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
              including our website at Verdan.io and any related applications, devices, or services (collectively,
              the &quot;Services&quot;), you agree to be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Services</h2>
            <p className="text-gray-600 leading-relaxed">
              Verdan.io LLC provides pond and water management automation services, including remote monitoring
              of water levels, automated valve control, sensor data collection, and related alert notifications.
              Our Services may include hardware controllers, cloud-based dashboards, and communication features
              such as SMS text message alerts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. SMS/Text Messaging Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By providing your phone number and opting in to SMS notifications, you consent to receive
              automated text messages from Verdan.io LLC related to your account and connected devices.
              These messages may include:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-3 space-y-1">
              <li>Water level alerts (high or low conditions)</li>
              <li>Valve fault or malfunction notifications</li>
              <li>Sensor fault alerts</li>
              <li>Device connectivity status updates</li>
              <li>Account and security notifications</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Message Frequency:</strong> Message frequency varies based on your device activity and
              alert configurations. You may receive up to 10 messages per day depending on system conditions.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Message and Data Rates:</strong> Message and data rates may apply. Check with your
              wireless carrier for details about your messaging plan.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Opt-Out:</strong> You can opt out of SMS notifications at any time by replying
              <strong> STOP</strong> to any message you receive from us. After opting out, you will receive
              a one-time confirmation message. You will no longer receive SMS alerts unless you re-subscribe.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Help:</strong> For help, reply <strong>HELP</strong> to any message or
              contact us at <a href="mailto:support@verdan.io" className="text-blue-600 hover:underline">support@verdan.io</a>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Supported Carriers:</strong> SMS services are supported on major U.S. carriers
              including AT&amp;T, Verizon, T-Mobile, and Sprint. Carriers are not liable for delayed or
              undelivered messages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for
              all activities that occur under your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to misuse our Services, interfere with their operation, or attempt to access
              them using methods other than the interfaces we provide. You may not use the Services for
              any unlawful purpose or in violation of any applicable laws or regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the fullest extent permitted by law, Verdan.io LLC shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of or relating to your
              use of the Services. Our Services involve automated monitoring and control of physical water
              systems. While we strive for reliability, we do not guarantee uninterrupted service and are
              not liable for any damages resulting from equipment malfunction, connectivity issues, or
              delayed notifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Modifications to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users
              of material changes by updating the date at the top of this page. Your continued use of the
              Services after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of
              Texas, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@verdan.io" className="text-blue-600 hover:underline">support@verdan.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
