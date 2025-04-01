
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: July 2023</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Swiggy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p>
          Subject to your compliance with these Terms, Swiggy grants you a limited, non-exclusive, non-transferable, and revocable license to access and use our platform for your internal business purposes.
        </p>
        <p className="mt-2">
          You may not:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Modify or copy our platform's materials.</li>
          <li>Use the materials for any commercial purpose or public display.</li>
          <li>Attempt to reverse engineer any software contained on Swiggy.</li>
          <li>Remove any copyright or other proprietary notations from the materials.</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <p>
          To access certain features of our platform, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <p className="mt-2">
          You agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Provide accurate, current, and complete information when creating an account.</li>
          <li>Update your information to keep it accurate, current, and complete.</li>
          <li>Notify us immediately of any unauthorized access or use of your account.</li>
          <li>Ensure that you exit from your account at the end of each session.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. User Content</h2>
        <p>
          Our platform allows you to submit, store, and share content, including text, audio recordings, and feedback submissions ("User Content"). You retain ownership of your User Content, but you grant Swiggy a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content for the purpose of operating and improving our platform.
        </p>
        <p className="mt-2">
          You are solely responsible for your User Content and agree that it will not:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Violate any third-party rights, including intellectual property rights.</li>
          <li>Be unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
          <li>Contain malicious code or attempt to interfere with the platform's operation.</li>
          <li>Collect or store personal data about other users without their consent.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. Disclaimer</h2>
        <p>
          Swiggy is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, secure, or error-free, or that defects will be corrected.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Swiggy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the platform.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">7. Termination</h2>
        <p>
          We may terminate or suspend your account and access to our platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the "Last Updated" date of these Terms. Your continued use of the platform after any changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:{" "}
          <a href="mailto:legal@Swiggy.com" className="text-orange-500 hover:text-orange-600">
            legal@Swiggy.com
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

export default TermsOfService;
