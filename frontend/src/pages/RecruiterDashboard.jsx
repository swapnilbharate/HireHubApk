import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../App'
import { Link } from 'react-router-dom'
import { 
  Plus, Edit2, Trash2, Calendar, MapPin, DollarSign, Building2, User, 
  Clock, CheckCircle, XCircle, Search, Sparkles, FileText, ChevronRight, Eye, Award, Briefcase, Loader2, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext)
  
  const [activeTab, setActiveTab] = useState('postings') // postings, applicants, interviews
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, shortlisted: 0, rejected: 0, pending: 0 })
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [interviews, setInterviews] = useState([])
  const [companyInfo, setCompanyInfo] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Job Modal
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJobId, setEditingJobId] = useState(null)
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'FULL_TIME',
    salaryRange: ''
  })
  
  const [skillInput, setSkillInput] = useState('')
  
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim().replace(',', '');
      if (val) {
        const currentSkills = jobForm.requirements ? jobForm.requirements.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (!currentSkills.includes(val)) {
          setJobForm({ ...jobForm, requirements: [...currentSkills, val].join(', ') });
        }
        setSkillInput('');
      }
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = jobForm.requirements ? jobForm.requirements.split(',').map(s => s.trim()).filter(Boolean) : [];
    setJobForm({ ...jobForm, requirements: currentSkills.filter(s => s !== skillToRemove).join(', ') });
  }

  // Interview Modal
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    locationOrLink: '',
    notes: ''
  })

  // Resume Preview Modal
  const [resumePreviewApp, setResumePreviewApp] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    
    // Fetch stats, jobs, applications, and interviews concurrently without blocking
    axios.get('/api/recruiter/stats').then(res => {
      setStats(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setError('Failed to load recruiter stats. Ensure backend is running.')
      setLoading(false)
    })
    
    axios.get('/api/jobs/my-postings').then(res => setJobs(res.data)).catch(console.error)
    axios.get('/api/applications/recruiter/list').then(res => setApplicants(res.data)).catch(console.error)
    axios.get('/api/recruiter/interviews').then(res => setInterviews(res.data)).catch(console.error)

    // Fetch company profile associated with recruiter user
    axios.get('/api/users/profile/details').then(profileRes => {
      if (profileRes.data.user) {
         // We can get company info from the jobs list once it loads
      }
    }).catch(console.error)
  }

  // Job form handles
  const handleJobSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingJobId) {
        await axios.put(`/api/jobs/${editingJobId}`, jobForm)
        toast.success('Job posting updated successfully!')
      } else {
        await axios.post('/api/jobs', jobForm)
        toast.success('New job opening posted successfully!')
      }
      setShowJobModal(false)
      fetchDashboardData()
    } catch (err) {
      toast.error('Failed to save job post details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`/api/jobs/${id}`)
        toast.success('Job posting deleted.')
        fetchDashboardData()
      } catch (err) {
        toast.error('Failed to delete job posting.')
      }
    }
  }

  // Applicant handles
  const handleStatusUpdate = async (appId, status) => {
    try {
      await axios.put(`/api/applications/${appId}/status`, null, {
        params: { status }
      })
      toast.success(`Applicant status updated to ${status}.`)
      fetchDashboardData()
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Endpoint: POST /api/recruiter/interviews/schedule
      await axios.post('/api/recruiter/interviews/schedule', null, {
        params: {
          applicationId: selectedApplicant.id,
          date: interviewForm.interviewDate,
          locationOrLink: interviewForm.locationOrLink,
          notes: interviewForm.notes
        }
      })
      toast.success('Interview scheduled and candidate notified!')
      setShowInterviewModal(false)
      fetchDashboardData()
    } catch (err) {
      toast.error('Failed to schedule interview.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED': return 'badge-status-shortlisted'
      case 'INTERVIEW_SCHEDULED': return 'badge-status-interview'
      case 'REJECTED': return 'badge-status-rejected'
      default: return 'badge-status-applied'
    }
  }

  return (
    <div className="animate-fade-in text-dark">
      {/* Recruiter Company Header Card */}
      <div className="card-main p-4 mb-4 shadow-sm bg-white">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div 
            className="bg-light rounded border p-2"
            style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Building2 className="text-primary" size={32} />
          </div>
          <div>
            <h3 className="fw-bold mb-0 text-dark">Recruitment Dashboard</h3>
            <p className="text-muted mb-0 fs-7">
              Logged in as a hiring representative for <strong>{companyInfo?.name || 'Partner Company'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="card-main p-4 bg-white shadow-sm stat-card-indigo">
            <h6 className="text-muted mb-1 fs-7 fw-semibold text-uppercase">Jobs Posted</h6>
            <h2 className="display-6 fw-bold text-gradient">{stats.totalJobs || jobs.length}</h2>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card-main p-4 bg-white shadow-sm stat-card-purple">
            <h6 className="text-muted mb-1 fs-7 fw-semibold text-uppercase">Apps Received</h6>
            <h2 className="display-6 fw-bold text-gradient">{stats.totalApplications}</h2>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card-main p-4 bg-white shadow-sm stat-card-teal">
            <h6 className="text-muted mb-1 fs-7 fw-semibold text-uppercase">Shortlisted</h6>
            <h2 className="display-6 fw-bold text-gradient">{stats.shortlisted}</h2>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card-main p-4 bg-white shadow-sm stat-card-rose">
            <h6 className="text-muted mb-1 fs-7 fw-semibold text-uppercase">Interviews</h6>
            <h2 className="display-6 fw-bold text-gradient">{interviews.length}</h2>
          </div>
        </div>
      </div>

      {/* Tabs Menu + Add job btn */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="tab-pills-custom">
          <button className={`tab-pill ${activeTab === 'postings' ? 'active' : ''}`} onClick={() => setActiveTab('postings')}>My Postings</button>
          <button className={`tab-pill ${activeTab === 'applicants' ? 'active' : ''}`} onClick={() => setActiveTab('applicants')}>Applicants ({applicants.length})</button>
          <button className={`tab-pill ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>Interviews ({interviews.length})</button>
        </div>
        
        {activeTab === 'postings' && (
          <button 
            className="btn btn-grad-primary d-flex align-items-center gap-1"
            onClick={() => {
              setEditingJobId(null)
              setJobForm({ title: '', description: '', requirements: '', location: '', jobType: 'FULL_TIME', salaryRange: '' })
              setShowJobModal(true)
            }}
          >
            <Plus size={18} /> Post New Job
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : activeTab === 'postings' ? (
        /* Postings tab */
        <div className="row g-4">
          {jobs.length === 0 ? (
            <div className="col-12"><div className="card-main text-center p-5 text-muted bg-white">No jobs posted yet. Click Post New Job to begin.</div></div>
          ) : (
            jobs.map(job => (
              <motion.div key={job.id} whileHover={{ scale: 1.01 }} className="col-12">
                <div className="card-main p-4 bg-white shadow-sm card-hover-border">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                      <div className="text-muted fs-8 mb-2">
                        <MapPin size={12} /> {job.location} • <Building2 size={12} /> {job.jobType.replace('_', ' ')}
                        {job.salaryRange && <span> • <DollarSign size={12} /> {job.salaryRange}</span>}
                      </div>
                      <p className="fs-7 text-body mb-3">{job.description.substring(0, 150)}...</p>
                      <div className="d-flex flex-wrap gap-1">
                        {job.requirements && job.requirements.split(',').map((req, idx) => (
                          <span key={idx} className="badge-skill fs-9">{req.trim()}</span>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-glass d-flex align-items-center gap-1"
                        onClick={() => {
                          setEditingJobId(job.id)
                          setJobForm({
                            title: job.title,
                            description: job.description,
                            requirements: job.requirements || '',
                            location: job.location,
                            jobType: job.jobType,
                            salaryRange: job.salaryRange || ''
                          })
                          setShowJobModal(true)
                        }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : activeTab === 'applicants' ? (
        /* Applicants tab */
        <div className="card-main bg-white shadow-sm overflow-hidden">
          {applicants.length === 0 ? (
            <div className="text-center p-5 text-muted">No applications received yet for your postings.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr className="fs-8 text-muted text-uppercase">
                    <th>Candidate</th>
                    <th>Applied For</th>
                    <th>ATS Match</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img 
                            src={app.user.profilePhotoUrl || '/images/avatars/default-avatar.png'} 
                            alt="Avatar" 
                            className="rounded-circle border" 
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/images/avatars/default-avatar.png' }}
                          />
                          <div>
                            <Link to={`/profile/${app.user.email}`} className="fw-semibold text-dark text-decoration-none hover-text-primary">
                              {app.user.fullName}
                            </Link>
                            <div className="text-muted fs-8">{app.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium text-dark">{app.job.title}</div>
                        <div className="text-muted fs-8">Date: {new Date(app.appliedAt).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${app.score}%`, background: 'var(--gradient-primary)' }}
                            ></div>
                          </div>
                          <span className="fw-bold fs-7">{app.score}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-status ${getStatusBadge(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        {app.resume ? (
                          <button 
                            className="btn btn-sm btn-outline-primary-custom d-flex align-items-center gap-1 px-2 py-1"
                            onClick={() => setResumePreviewApp(app)}
                          >
                            <Eye size={14} /> View
                          </button>
                        ) : (
                          <span className="text-muted fs-8">N/A</span>
                        )}
                      </td>
                      <td className="text-end">
                        {app.status === 'APPLIED' && (
                          <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-outline-success p-1" onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}>Shortlist</button>
                            <button className="btn btn-sm btn-outline-danger p-1" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>Reject</button>
                          </div>
                        )}
                        {app.status === 'SHORTLISTED' && (
                          <button 
                            className="btn btn-sm btn-grad-primary"
                            onClick={() => {
                              setSelectedApplicant(app)
                              setInterviewForm({ interviewDate: '', locationOrLink: '', notes: '' })
                              setShowInterviewModal(true)
                            }}
                          >
                            Schedule Interview
                          </button>
                        )}
                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <span className="text-muted fs-8 d-inline-flex align-items-center gap-1">
                            <CheckCircle size={14} className="text-success" /> Panel Scheduled
                          </span>
                        )}
                        {app.status === 'REJECTED' && <span className="text-danger fs-8">Rejected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Interviews tab */
        <div className="row g-4">
          {interviews.length === 0 ? (
            <div className="col-12"><div className="card-main text-center p-5 text-muted bg-white">No interviews scheduled yet. Shortlist applicants to schedule.</div></div>
          ) : (
            interviews.map(meet => (
              <motion.div key={meet.id} whileHover={{ scale: 1.01 }} className="col-md-6 col-lg-6">
                <div className="card-main p-4 bg-white shadow-sm border border-light position-relative">
                  <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-2">
                    <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{meet.application.user.fullName}</h6>
                      <span className="text-muted fs-8">For: {meet.application.job.title}</span>
                    </div>
                  </div>
                  <ul className="list-unstyled fs-7 text-muted mb-0">
                    <li className="mb-2 d-flex align-items-center gap-2">
                      <Clock size={16} className="text-primary" /> 
                      <strong>Date & Time:</strong> {new Date(meet.interviewDate).toLocaleString()}
                    </li>
                    <li className="mb-2 d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-primary" /> 
                      <strong>Location / Link:</strong> 
                      <a href={meet.locationOrLink} target="_blank" rel="noreferrer" className="text-primary text-decoration-none text-truncate" style={{ maxWidth: '180px' }}>
                        {meet.locationOrLink}
                      </a>
                    </li>
                    {meet.notes && (
                      <li className="d-flex align-items-start gap-2">
                        <FileText size={16} className="text-primary mt-1" />
                        <div><strong>Agenda/Notes:</strong><br />{meet.notes}</div>
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* MODALS */}
      {/* 1. Job Modal (Create/Edit) */}
      {showJobModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-content border-light rounded-4 shadow-lg p-3" 
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Briefcase size={20} className="text-primary" />
                  {editingJobId ? 'Edit Job Posting' : 'Post New Job'}
                </h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowJobModal(false)}></button>
              </div>
              <form onSubmit={handleJobSubmit}>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-8">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Job Title</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted"><Briefcase size={16} /></span>
                        <input 
                          type="text" 
                          className="form-control input-main border-0 bg-light" 
                          placeholder="e.g. Senior Software Engineer"
                          value={jobForm.title}
                          onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Job Type</label>
                      <select 
                        className="form-select input-main bg-light border-0"
                        value={jobForm.jobType}
                        onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })}
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="REMOTE">Remote</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Location</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted"><MapPin size={16} /></span>
                        <input 
                          type="text" 
                          className="form-control input-main border-0 bg-light" 
                          placeholder="e.g. New York, NY or Remote"
                          value={jobForm.location}
                          onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Salary Range</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 text-muted"><DollarSign size={16} /></span>
                        <input 
                          type="text" 
                          className="form-control input-main border-0 bg-light" 
                          placeholder="e.g. ₹10,00,000 - ₹15,00,000"
                          value={jobForm.salaryRange}
                          onChange={e => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Required Skills</label>
                      <div className="p-2 bg-light border-0 rounded d-flex flex-wrap gap-2 align-items-center" style={{ minHeight: '42px' }}>
                        <Sparkles size={16} className="text-muted ms-1 me-1" />
                        
                        {(jobForm.requirements ? jobForm.requirements.split(',').map(s => s.trim()).filter(Boolean) : []).map((skill, idx) => (
                          <span key={idx} className="badge bg-primary text-white d-flex align-items-center gap-1 px-2 py-1 fs-8 rounded-pill">
                            {skill}
                            <X size={12} style={{cursor: 'pointer'}} onClick={() => handleRemoveSkill(skill)} />
                          </span>
                        ))}
                        
                        <input 
                          type="text" 
                          className="border-0 bg-transparent flex-grow-1 fs-7" 
                          style={{ outline: 'none', minWidth: '150px' }}
                          placeholder="Type skill & press Enter..."
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={handleAddSkill}
                        />
                      </div>
                      <span className="text-muted fs-8 mt-1 d-block">Press Enter or comma to add a skill. Used for ATS calculation.</span>
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7 fw-medium text-muted mb-1">Job Description</label>
                      <div className="position-relative">
                        <FileText size={16} className="position-absolute text-muted" style={{ top: '12px', left: '14px' }} />
                        <textarea 
                          className="form-control input-main bg-light border-0" 
                          rows="3"
                          style={{ paddingLeft: '40px' }}
                          placeholder="Describe the responsibilities and ideal candidate profile..."
                          value={jobForm.description}
                          onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowJobModal(false)} disabled={isSubmitting}>Cancel</button>
                  <button type="submit" className="btn btn-grad-primary px-4 rounded-pill shadow-sm" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={16} className="spin me-2"/>Saving...</> : editingJobId ? 'Save Changes' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      {/* 2. Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-light rounded-4 shadow-lg p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Schedule Interview Panel</h5>
                <button type="button" className="btn-close" onClick={() => setShowInterviewModal(false)}></button>
              </div>
              <form onSubmit={handleScheduleInterviewSubmit}>
                <div className="modal-body">
                  <p className="fs-7 text-muted mb-3">
                    Scheduling interview for <strong>{selectedApplicant?.user.fullName}</strong> for the role of <strong>{selectedApplicant?.job.title}</strong>.
                  </p>
                  <div className="row g-2">
                    <div className="col-12">
                      <label className="form-label fs-7">Interview Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="form-control input-main" 
                        value={interviewForm.interviewDate}
                        onChange={e => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7">Meeting Coordinates / Google Meet Link</label>
                      <input 
                        type="text" 
                        className="form-control input-main" 
                        placeholder="https://meet.google.com/abc-def-ghi"
                        value={interviewForm.locationOrLink}
                        onChange={e => setInterviewForm({ ...interviewForm, locationOrLink: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fs-7">Agenda / Recruiter Notes</label>
                      <textarea 
                        className="form-control input-main" 
                        rows="2"
                        placeholder="Covering system design, concurrency, databases..."
                        value={interviewForm.notes}
                        onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-glass" onClick={() => setShowInterviewModal(false)} disabled={isSubmitting}>Cancel</button>
                  <button type="submit" className="btn btn-grad-primary" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={16} className="spin me-2"/>Confirming...</> : 'Confirm & Notify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Resume Preview Modal */}
      {resumePreviewApp && (() => {
        const app = resumePreviewApp
        const resume = app.resume
        let aiData = null
        try {
          aiData = resume?.aiAnalysis ? JSON.parse(resume.aiAnalysis) : null
        } catch (e) { /* ignore parse errors */ }

        return (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15,23,42,0.55)' }} onClick={() => setResumePreviewApp(null)}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content rounded-4 shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #475569 100%)', padding: '20px 28px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={app.user?.profilePhotoUrl || '/images/avatars/default-avatar.png'} 
                        alt="Avatar" 
                        className="rounded-circle border border-2 border-white" 
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/images/avatars/default-avatar.png' }}
                      />
                      <div>
                        <h5 className="fw-bold text-white mb-0">{app.user?.fullName}</h5>
                        <span className="text-white" style={{ opacity: 0.8, fontSize: '0.85rem' }}>{app.user?.email} • Applied for: {app.job?.title}</span>
                      </div>
                    </div>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setResumePreviewApp(null)}></button>
                  </div>
                </div>

                {/* Body */}
                <div className="modal-body p-0">
                  <div className="row g-0">
                    {/* Left: Parsed Resume Text */}
                    <div className="col-md-7 p-4" style={{ borderRight: '1px solid var(--border-light)', maxHeight: '60vh', overflowY: 'auto' }}>
                      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <FileText size={16} className="text-primary" /> Parsed Resume Content
                      </h6>
                      {resume?.parsedText ? (
                        <pre className="fs-8 text-body bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', lineHeight: '1.7', border: '1px solid var(--border-light)' }}>
                          {resume.parsedText}
                        </pre>
                      ) : (
                        <div className="text-muted text-center py-4 fs-7">No parsed resume text available for this candidate.</div>
                      )}
                      {resume?.fileName && (
                        <div className="mt-3 text-muted fs-8 d-flex align-items-center gap-1">
                          <FileText size={12} /> File: {resume.fileName}
                        </div>
                      )}
                    </div>

                    {/* Right: AI Analysis */}
                    <div className="col-md-5 p-4" style={{ backgroundColor: 'var(--bg-section)', maxHeight: '60vh', overflowY: 'auto' }}>
                      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <Award size={16} className="text-primary" /> AI Analysis Report
                      </h6>

                      {/* ATS Score */}
                      <div className="card-main p-3 mb-3 bg-white" style={{ border: '1px solid var(--border-light)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold text-dark fs-7">ATS Match Score</span>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold">
                            {resume?.aiScore ?? app.score ?? '--'}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${resume?.aiScore ?? app.score ?? 0}%`, background: 'var(--gradient-primary)' }}
                          ></div>
                        </div>
                      </div>

                      {aiData ? (
                        <>
                          {aiData.overall_rating && (
                            <div className="mb-3">
                              <span className="fw-semibold text-dark fs-7">Rating: </span>
                              <span className="text-primary fw-bold">{aiData.overall_rating}</span>
                            </div>
                          )}
                          {aiData.strengths && aiData.strengths.length > 0 && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-success fs-7 mb-1">Strengths</h6>
                              <ul className="ps-3 mb-0 fs-8 text-muted">
                                {aiData.strengths.map((s, i) => <li key={i} className="mb-1">{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {aiData.gaps && aiData.gaps.length > 0 && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-danger fs-7 mb-1">Gaps</h6>
                              <ul className="ps-3 mb-0 fs-8 text-muted">
                                {aiData.gaps.map((g, i) => <li key={i} className="mb-1">{g}</li>)}
                              </ul>
                            </div>
                          )}
                          {aiData.recommendations && aiData.recommendations.length > 0 && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-primary fs-7 mb-1">Recommendations</h6>
                              <ul className="ps-3 mb-0 fs-8 text-muted">
                                {aiData.recommendations.map((r, i) => <li key={i} className="mb-1">{r}</li>)}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-muted fs-8 text-center py-3">No AI analysis data available.</div>
                      )}

                      {/* Quick Actions */}
                      <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <h6 className="fw-bold text-dark mb-2 fs-7">Quick Actions</h6>
                        <div className="d-flex gap-2 flex-wrap">
                          {app.status === 'APPLIED' && (
                            <>
                              <button className="btn btn-sm btn-outline-success flex-fill" onClick={() => { handleStatusUpdate(app.id, 'SHORTLISTED'); setResumePreviewApp(null); }}>
                                <CheckCircle size={14} className="me-1" /> Shortlist
                              </button>
                              <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => { handleStatusUpdate(app.id, 'REJECTED'); setResumePreviewApp(null); }}>
                                <XCircle size={14} className="me-1" /> Reject
                              </button>
                            </>
                          )}
                          {app.status === 'SHORTLISTED' && (
                            <button className="btn btn-sm btn-grad-primary flex-fill" onClick={() => { setResumePreviewApp(null); setSelectedApplicant(app); setInterviewForm({ interviewDate: '', locationOrLink: '', notes: '' }); setShowInterviewModal(true); }}>
                              <Calendar size={14} className="me-1" /> Schedule Interview
                            </button>
                          )}
                          {(app.status === 'INTERVIEW_SCHEDULED' || app.status === 'REJECTED') && (
                            <span className="text-muted fs-8 d-flex align-items-center gap-1 py-1">
                              <CheckCircle size={14} className="text-success" /> Status: {app.status.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
