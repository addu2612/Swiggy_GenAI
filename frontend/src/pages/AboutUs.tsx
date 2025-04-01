
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Heart, Award } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="container py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Swiggy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From food delivery to feedback management, we're redefining how India connects and communicates.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg mb-4">
              Founded in 2014, Swiggy began as a hyperlocal food delivery service in Bangalore. Today, we've grown into India's leading on-demand delivery platform.
            </p>
            <p className="text-lg mb-4">
              Our journey has been one of constant innovation - from pioneering 30-minute deliveries to launching Swiggy Instamart, and now expanding into enterprise feedback management.
            </p>
            <p className="text-lg">
              With over 5,000 employees and a presence in 500+ cities, we continue to connect customers with the services they need, when they need them - whether it's food, groceries, or now, meaningful organizational feedback.
            </p>
          </div>
          <div className="bg-orange-100 p-8 rounded-lg">
            <blockquote className="italic text-lg border-l-4 border-orange-500 pl-4">
              "Everything we do is about giving people more time to pursue their passions and enhancing their quality of life. With our new feedback platform, we're bringing that same convenience and reliability to organizational improvement."
              <footer className="mt-2 font-medium text-orange-700">— Sriharsha Majety, Co-founder & CEO, Swiggy</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                We put our customers at the center of everything we do, focusing on their needs and desires.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every delivery, every interaction, and every piece of feedback.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Empathy</h3>
              <p className="text-muted-foreground">
                We understand our customers' needs and design solutions with genuine care and understanding.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We constantly push boundaries and explore new ways to solve problems and delight our customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gradient">Our Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Sriharsha Majety",
              role: "Co-founder & CEO",
              bio: "Sriharsha is the visionary leader who has guided Swiggy from a small startup to India's leading delivery platform.",
              imgSrc: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&auto=format&fit=crop"
            },
            {
              name: "Nandan Reddy",
              role: "Co-founder",
              bio: "Nandan has been instrumental in scaling Swiggy's operations and exploring new business opportunities.",
              imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&auto=format&fit=crop"
            },
            {
              name: "Lakshmi Nandan",
              role: "CTO",
              bio: "Lakshmi leads Swiggy's technology initiatives, ensuring our platforms are secure, scalable, and user-friendly.",
              imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&auto=format&fit=crop"
            }
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.imgSrc} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-orange-600 mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gradient">Contact Us</h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
                <p className="mb-6">
                  We'd love to hear from you! Whether you have questions about our food delivery service, feedback platform, 
                  or want to explore partnership opportunities, our team is here to help.
                </p>
                <div className="space-y-3">
                  <p><strong>Email:</strong> support@swiggy.com</p>
                  <p><strong>Phone:</strong> 1800-267-4444</p>
                  <p><strong>Corporate Address:</strong> Bundl Technologies Pvt. Ltd., No. 55, Salarpuria Arena, Hosur Main Road, Bengaluru - 560095</p>
                </div>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
                <p className="mb-2">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                <p>Weekend: 10:00 AM - 4:00 PM IST</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Support</h3>
                <p className="mb-2">For technical support, please email:</p>
                <p className="text-orange-600">techsupport@swiggy.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutUs;
