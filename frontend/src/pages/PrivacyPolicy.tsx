
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: July 2023</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to Swiggy ("we," "our," or "us"). We are committed to protecting your privacy and handling your data with transparency and care. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our feedback management platform.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Account Information:</strong> Name, email address, organization name, and role.</li>
          <li><strong>Usage Data:</strong> Information about how you use our platform, including feedback submissions, responses, and interactions.</li>
          <li><strong>Voice Recordings:</strong> When you use our voice-to-text feature, we temporarily store audio recordings to process them into text.</li>
          <li><strong>Device Information:</strong> Information about the device and browser you use to access our platform.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>To provide and maintain our platform and services.</li>
          <li>To process and store feedback data submitted through our platform.</li>
          <li>To improve our platform and develop new features.</li>
          <li>To communicate with you about your account and our services.</li>
          <li>To detect and prevent fraudulent activity and security incidents.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. How We Share Your Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Service Providers:</strong> Third-party vendors who help us provide our services.</li>
          <li><strong>Within Your Organization:</strong> Information shared with other authorized users within your organization according to your settings.</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights or the safety of users.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights and Choices</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Access or update your personal information.</li>
          <li>Delete your account and associated data.</li>
          <li>Export your data in a portable format.</li>
          <li>Opt-out of certain data collection practices.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">6. Security</h2>
        <p>
          We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:{" "}
          <a href="mailto:privacy@Swiggy.com" className="text-orange-500 hover:text-orange-600">
            privacy@Swiggy.com
          </a>
        </p>
        
        <div className="mt-12 pt-6 border-t">
          <Link to="/" className="text-orange-500 hover:text-orange-600">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
