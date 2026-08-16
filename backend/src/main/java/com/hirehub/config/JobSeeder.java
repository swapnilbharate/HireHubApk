package com.hirehub.config;

import com.hirehub.entity.*;
import com.hirehub.repository.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;
import java.util.ArrayList;
import java.util.List;

@Configuration
@DependsOn("initRoles")
public class JobSeeder {

    @Bean
    CommandLineRunner initJobs(
            JobRepository jobRepository,
            CompanyRepository companyRepository,
            RecruiterRepository recruiterRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            TransactionTemplate transactionTemplate) {
        return args -> {
            transactionTemplate.execute(status -> {
                if (jobRepository.count() == 0) {
                    Role recruiterRole = roleRepository.findByName("ROLE_RECRUITER")
                            .orElseThrow(() -> new RuntimeException("ROLE_RECRUITER not found"));

                // 1. Seed Indian Companies
                String[][] companyData = {
                    {"TCS", "Tata Consultancy Services is a global leader in IT services, consulting & business solutions.", "IT Services", "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", "Mumbai, Maharashtra", "/images/companies/google-office.png"},
                    {"Infosys", "Infosys is a global leader in next-generation digital services and consulting.", "IT Services", "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", "Bengaluru, Karnataka", "/images/companies/microsoft-office.png"},
                    {"Cred", "CRED is a members-only credit card bill payment platform that rewards its members.", "Fintech Startup", "https://upload.wikimedia.org/wikipedia/commons/e/e4/CRED_Logo_2021.png", "Bengaluru, Karnataka", "/images/companies/meta-office.png"},
                    {"Razorpay", "Razorpay is the only payments solution in India that allows businesses to accept, process and disburse payments.", "Fintech Startup", "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", "Bengaluru, Karnataka", "/images/companies/amazon-office.png"},
                    {"Groww", "Groww is an online investment platform that allows investors to open an account and trade in mutual funds and stocks.", "Fintech Startup", "https://upload.wikimedia.org/wikipedia/commons/4/41/Groww_app_logo.png", "Bengaluru, Karnataka", "/images/companies/google-office.png"},
                    {"Zomato", "Zomato is an Indian multinational restaurant aggregator and food delivery company.", "Food Tech", "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg", "Gurugram, Haryana", "/images/companies/microsoft-office.png"},
                    {"Flipkart", "Flipkart is India's leading e-commerce marketplace.", "E-commerce", "https://upload.wikimedia.org/wikipedia/commons/1/17/Flipkart_logo.png", "Bengaluru, Karnataka", "/images/companies/meta-office.png"},
                    {"Swiggy", "Swiggy is India’s leading on-demand convenience platform.", "Food Tech", "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.svg", "Bengaluru, Karnataka", "/images/companies/amazon-office.png"}
                };

                List<Company> companies = new ArrayList<>();
                for (String[] data : companyData) {
                    Company company = companyRepository.findFirstByName(data[0]).orElse(null);
                    if (company == null) {
                        company = new Company();
                        company.setName(data[0]);
                        company.setDescription(data[1]);
                        company.setIndustry(data[2]);
                        company.setLogoUrl(data[3]);
                        company.setLocation(data[4]);
                        company.setCoverPhotoUrl(data[5]);
                        company.setSize("10000+");
                        company.setFoundedYear(2010);
                        company = companyRepository.save(company);
                    }
                    companies.add(company);
                }

                // 2. Seed Recruiter Users
                String[][] recruiterUserData = {
                    {"tcs.hr@hirehub.com", "TCS HR Manager", "Senior Recruiter"},
                    {"infosys.hr@hirehub.com", "Infosys Talent Acquisition", "HR Lead"},
                    {"cred.hr@hirehub.com", "Cred Recruitment Team", "Head of Hiring"},
                    {"razorpay.hr@hirehub.com", "Razorpay Talent Partner", "Talent Acquisition"},
                    {"groww.hr@hirehub.com", "Groww HR Team", "Recruiting Specialist"},
                    {"zomato.hr@hirehub.com", "Zomato Careers", "Technical Recruiter"},
                    {"flipkart.hr@hirehub.com", "Flipkart Talent Acquisition", "Principal Recruiter"},
                    {"swiggy.hr@hirehub.com", "Swiggy Careers", "HR Specialist"}
                };

                List<Recruiter> recruiters = new ArrayList<>();
                for (int i = 0; i < recruiterUserData.length; i++) {
                    String[] data = recruiterUserData[i];
                    
                    User user = userRepository.findFirstByEmail(data[0]).orElse(null);
                    if (user == null) {
                        user = new User();
                        user.setEmail(data[0]);
                        user.setPassword(passwordEncoder.encode("password123"));
                        user.setFullName(data[1]);
                        user.setRole(recruiterRole);
                        user.setStatus("ACTIVE");
                        user.setProfilePhotoUrl("/images/avatars/default-avatar.png");
                        user.setHeadline(data[2] + " at " + companies.get(i).getName());
                        user = userRepository.save(user);
                    }

                    Recruiter recruiter = recruiterRepository.findFirstByUserEmail(data[0]).orElse(null);
                    if (recruiter == null) {
                        recruiter = new Recruiter();
                        recruiter.setUser(user);
                        recruiter.setCompany(companies.get(i));
                        recruiter.setPosition(data[2]);
                        recruiter = recruiterRepository.save(recruiter);
                    }
                    recruiters.add(recruiter);
                }

                // 3. Seed 15 Realistic Jobs
                Object[][] jobsData = {
                    {"Software Engineer - Java", "We are looking for a Java Developer with experience in Spring Boot, REST APIs, and SQL to join our core development team.", "Java, Spring Boot, REST API, SQL, Hibernate", "Bengaluru, Karnataka", "FULL_TIME", "₹8,00,000 - ₹14,00,000", 0},
                    {"Frontend Developer - React", "Join us to build state-of-the-art web applications. You will collaborate with designers to construct modern user experiences.", "React, JavaScript, HTML5, CSS3, Tailwind CSS", "Mumbai, Maharashtra", "FULL_TIME", "₹7,50,000 - ₹12,50,000", 0},
                    {"DevOps Engineer", "Develop and optimize our CI/CD pipelines, configure AWS infrastructure, and maintain container deployments.", "AWS, Docker, Kubernetes, Jenkins, Terraform", "Pune, Maharashtra", "FULL_TIME", "₹12,00,000 - ₹18,00,000", 1},
                    {"QA Automation Engineer", "Design and build test automation frameworks using Selenium and JUnit. Deliver clean, high-quality test coverage.", "Selenium, Java, Automation Testing, JUnit", "Noida, Uttar Pradesh", "FULL_TIME", "₹6,00,000 - ₹10,00,000", 1},
                    {"Android App Developer", "We are seeking a Mobile Developer to design and update our native Android app using Flutter and Riverpod.", "Flutter, Dart, Android SDK, Git", "Hyderabad, Telangana", "FULL_TIME", "₹9,00,000 - ₹15,00,000", 2},
                    {"Full Stack Developer", "Develop frontend and backend services. Bridge the gap between server logic and UI elements using React and Node.", "Node.js, React, MongoDB, Express, JavaScript", "Gurugram, Haryana", "FULL_TIME", "₹10,00,000 - ₹17,00,000", 3},
                    {"Data Scientist", "Analyze customer data trends, train machine learning models, and implement data pipelines to boost business growth.", "Python, SQL, Machine Learning, Pandas, Scikit-Learn", "Bengaluru, Karnataka", "FULL_TIME", "₹14,00,000 - ₹22,00,000", 3},
                    {"Product Manager", "Lead product development lifecycle from planning to launch. Define features, write requirements, and collaborate with engineering.", "Product Strategy, Agile, Jira, Scrum", "Mumbai, Maharashtra", "FULL_TIME", "₹15,00,000 - ₹25,00,000", 4},
                    {"Business Analyst", "Translate client business goals into technical specs. Formulate solutions and run workshops.", "Business Analysis, SQL, Agile, Requirement Gathering", "Pune, Maharashtra", "FULL_TIME", "₹6,50,000 - ₹11,00,000", 4},
                    {"Cloud Architect", "Design secure cloud architecture strategies. Migrate databases to Neon PostgreSQL and manage cloud security.", "AWS, Azure, Cloud Security, Database Management", "Noida, Uttar Pradesh", "FULL_TIME", "₹18,00,000 - ₹30,00,000", 5},
                    {"Python Backend Developer", "Develop scalable backend services and scrapers using Python, Django, and Fast API.", "Python, Django, FastAPI, PostgreSQL", "Gurugram, Haryana", "FULL_TIME", "₹8,00,000 - ₹13,00,000", 5},
                    {"UI/UX Designer", "Produce wireframes, mockups, and layout prototypes. Gather user feedback and map customer journeys.", "Figma, Adobe XD, Wireframing, Prototyping", "Bengaluru, Karnataka", "FULL_TIME", "₹6,00,000 - ₹11,00,000", 6},
                    {"Technical Writer", "Draft developer documentation, SDK guides, and API integration guides.", "Technical Writing, Markdown, API Documentation", "Hyderabad, Telangana", "CONTRACT", "₹4,00,000 - ₹7,00,000", 6},
                    {"Cybersecurity Analyst", "Monitor network threats, implement security audits, and secure authentication pipelines.", "Network Security, Penetration Testing, IAM, Linux", "Pune, Maharashtra", "FULL_TIME", "₹11,00,000 - ₹16,50,000", 7},
                    {"iOS App Developer", "Design premium iOS apps using Swift and SwiftUI. Build smooth, responsive interfaces.", "Swift, SwiftUI, iOS SDK, Xcode", "Bengaluru, Karnataka", "REMOTE", "₹10,00,000 - ₹16,00,000", 7}
                };

                for (Object[] jobData : jobsData) {
                    Job job = new Job();
                    job.setTitle((String) jobData[0]);
                    job.setDescription((String) jobData[1]);
                    job.setRequirements((String) jobData[2]);
                    job.setLocation((String) jobData[3]);
                    job.setJobType((String) jobData[4]);
                    job.setSalaryRange((String) jobData[5]);
                    job.setStatus("OPEN");
                    
                    int recruiterIndex = (int) jobData[6];
                    Recruiter recruiter = recruiters.get(recruiterIndex);
                    job.setRecruiter(recruiter);
                    job.setCompany(recruiter.getCompany());
                    
                    jobRepository.save(job);
                }

                System.out.println("Seeded 15 initial jobs with Indian companies.");
                }
                return null;
            });
        };
    }
}
