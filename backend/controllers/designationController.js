import Designation from '../models/designationModel.js';
import DesignationQualification from '../models/designationQualificationModel.js';
import Company from '../models/companyModel.js';
import OrgStructure from '../models/orgStructureModel.js';
import AuditLog from '../models/auditLogModel.js';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.findAll({
      include: [
        { model: Company, attributes: ['CompanyName'] },
        { model: OrgStructure, as: 'Structure', attributes: ['StructureName'] },
        { model: DesignationQualification, as: 'Qualifications' },
      ],
    });
    res.status(200).json(designations);
  } catch (error) {
    console.error('Get all designations error:', error);
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};

export const getDesignation = async (req, res) => {
  try {
    const { designationId } = req.params;
    const designation = await Designation.findByPk(designationId, {
      include: [
        { model: Company, attributes: ['CompanyName'] },
        { model: OrgStructure, as: 'Structure', attributes: ['StructureName'] },
        { model: DesignationQualification, as: 'Qualifications' },
      ],
    });
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }
    res.status(200).json(designation);
  } catch (error) {
    console.error('Get designation error:', error);
    res.status(500).json({ error: 'Failed to fetch designation' });
  }
};

export const createDesignation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { CompanyId, OrgStructureId, Name, JobDescription, NoOfPosition, isActive, Qualifications } = req.body;
    const currentUserId = req.user.userId;

    if (!CompanyId || !OrgStructureId || !Name || !NoOfPosition) {
      await t.rollback();
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const company = await Company.findByPk(CompanyId, { transaction: t });
    if (!company) {
      await t.rollback();
      return res.status(404).json({ error: 'Company not found' });
    }

    const structure = await OrgStructure.findByPk(OrgStructureId, { transaction: t });
    if (!structure) {
      await t.rollback();
      return res.status(404).json({ error: 'Organizational structure not found' });
    }

    const designation = await Designation.create({
      DesignationId: uuidv4(),
      CompanyId,
      OrgStructureId,
      Name,
      JobDescription,
      NoOfPosition,
      isActive: isActive ?? true,
    }, { transaction: t });

    if (Qualifications && Array.isArray(Qualifications)) {
      const qualData = Qualifications.map(qual => ({
        DesignationQualificationId: uuidv4(),
        CompanyId,
        DesignationId: designation.DesignationId,
        QualificationName: qual.QualificationName,
        ServiceYear: qual.ServiceYear,
        RelatedServiceYear: qual.RelatedServiceYear,
        AllowRelatedQualification: qual.AllowRelatedQualification ?? false,
      }));
      await DesignationQualification.bulkCreate(qualData, { transaction: t });
    }

    await AuditLog.create({
      Action: 'Create Designation',
      UserId: currentUserId,
      TargetId: designation.DesignationId,
      EntityId: designation.DesignationId,
      EntityType: 'Designation',
      Timestamp: new Date(),
      Details: JSON.stringify({ CompanyId, OrgStructureId, Name, Qualifications }),
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Designation created successfully', designationId: designation.DesignationId });
  } catch (error) {
    await t.rollback();
    console.error('Create designation error:', error);
    res.status(500).json({ error: 'Failed to create designation' });
  }
};

export const updateDesignation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { designationId } = req.params;
    const { CompanyId, OrgStructureId, Name, JobDescription, NoOfPosition, isActive, Qualifications } = req.body;
    const currentUserId = req.user.userId;

    const designation = await Designation.findByPk(designationId, { transaction: t });
    if (!designation) {
      await t.rollback();
      return res.status(404).json({ error: 'Designation not found' });
    }

    if (!CompanyId || !OrgStructureId || !Name || !NoOfPosition) {
      await t.rollback();
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const company = await Company.findByPk(CompanyId, { transaction: t });
    if (!company) {
      await t.rollback();
      return res.status(404).json({ error: 'Company not found' });
    }

    const structure = await OrgStructure.findByPk(OrgStructureId, { transaction: t });
    if (!structure) {
      await t.rollback();
      return res.status(404).json({ error: 'Organizational structure not found' });
    }

    const oldData = designation.toJSON();
    await designation.update({
      CompanyId,
      OrgStructureId,
      Name,
      JobDescription,
      NoOfPosition,
      isActive: isActive ?? true,
    }, { transaction: t });

    await DesignationQualification.destroy({ where: { DesignationId: designationId }, transaction: t });
    if (Qualifications && Array.isArray(Qualifications)) {
      const qualData = Qualifications.map(qual => ({
        DesignationQualificationId: uuidv4(),
        CompanyId,
        DesignationId: designationId,
        QualificationName: qual.QualificationName,
        ServiceYear: qual.ServiceYear,
        RelatedServiceYear: qual.RelatedServiceYear,
        AllowRelatedQualification: qual.AllowRelatedQualification ?? false,
      }));
      await DesignationQualification.bulkCreate(qualData, { transaction: t });
    }

    await AuditLog.create({
      Action: 'Update Designation',
      UserId: currentUserId,
      TargetId: designationId,
      EntityId: designationId,
      EntityType: 'Designation',
      Timestamp: new Date(),
      Details: JSON.stringify({ old: oldData, new: { CompanyId, OrgStructureId, Name, Qualifications } }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Designation updated successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Update designation error:', error);
    res.status(500).json({ error: 'Failed to update designation' });
  }
};

export const deleteDesignation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { designationId } = req.params;
    const currentUserId = req.user.userId;

    const designation = await Designation.findByPk(designationId, { transaction: t });
    if (!designation) {
      await t.rollback();
      return res.status(404).json({ error: 'Designation not found' });
    }

    const designationData = designation.toJSON();
    await DesignationQualification.destroy({ where: { DesignationId: designationId }, transaction: t });
    await designation.destroy({ transaction: t });

    await AuditLog.create({
      Action: 'Delete Designation',
      UserId: currentUserId,
      TargetId: designationId,
      EntityId: designationId,
      EntityType: 'Designation',
      Timestamp: new Date(),
      Details: JSON.stringify({ deleted: designationData }),
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Designation deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Delete designation error:', error);
    res.status(500).json({ error: 'Failed to delete designation' });
  }
};