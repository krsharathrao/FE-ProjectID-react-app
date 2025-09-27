import React from 'react';
import './ProjectCard.css';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    return 'Invalid Date';
  }
};

const renderValue = (value) => value || '—';

const ProjectCard = ({ project, role, onEdit, onGeneratePID, onSubmitForSuperAdminReview, onSuperadminApprove, onSuperadminReject }) => {

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{renderValue(project.projectName)}</h3>
        <span className={`status-badge status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>{renderValue(project.status)}</span>
      </div>

      <div className="project-card-body">
        <div className="info-grid">
          <div className="info-item full-width"><strong>PID:</strong><span>{renderValue(project.generatedPID)}</span></div>
          <div className="info-item"><strong>Customer:</strong><span>{renderValue(project.customerName)}</span></div>
          <div className="info-item"><strong>Business Unit:</strong><span>{renderValue(project.buName)}</span></div>
          <div className="info-item"><strong>Billing Type:</strong><span>{renderValue(project.billingTypeName)}</span></div>
          <div className="info-item"><strong>Segment:</strong><span>{renderValue(project.segmentName)}</span></div>
          <div className="info-item"><strong>Start Date:</strong><span>{formatDate(project.projectStartDate)}</span></div>
          <div className="info-item"><strong>End Date:</strong><span>{formatDate(project.projectEndDate)}</span></div>
        </div>

        {project.approvalRemarks && (
          <>
            <hr className="remarks-divider" />
            <div className="remarks-section">
              <strong>Remarks:</strong>
              <div className="remarks-content">{renderValue(project.approvalRemarks)}</div>
            </div>
          </>
        )}
      </div>

      <div className="project-card-footer">
        <div className="action-buttons">
          {(role === 'Admin' || role === 'SuperAdmin') && (
            <>
              {(project.status === 'PendingPIDGeneration' || project.status === 'NeedsRevision') && (
                <>
                  <button className="btn btn-edit" onClick={() => onEdit(project)}>Edit</button>
                  <button className="btn btn-submit" onClick={() => onGeneratePID(project)}>Generate PID</button>
                </>
              )}
            {project.status === 'pendingsuperadminapproval' &&  <button className="btn btn-submit" onClick={() => onSubmitForSuperAdminReview(project)}>Submit for Review</button>}
            </>
          )} 
          {role === 'SuperAdmin' && project.status === 'PendingSuperAdminApproval' && (
            <>
              <button className="btn btn-approve" onClick={() => onSuperadminApprove(project)}>Approve</button>
              <button className="btn btn-reject" onClick={() => onSuperadminReject(project)}>Reject</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
