import Designation from '../models/designationModel.js';
import OrgStructure from '../models/orgStructureModel.js';
import Company from '../models/companyModel.js';
import sequelize from '../config/database.js';

export const getDesignationSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    let whereClause = {};
    if (companyId) {
      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ 
          success: false,
          error: 'Company not found' 
        });
      }
      whereClause = { CompanyId: companyId };
    }

    const reportData = await OrgStructure.findAll({
      where: whereClause,
      attributes: [
        'OrgStructureId',
        'StructureName',
        [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('Designations.DesignationId')), 0), 'DesignationCount'],
      ],
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['CompanyName'],
          required: true,
        },
        {
          model: Designation,
          attributes: [],
          required: false,
        },
      ],
      group: [
        'OrgStructure.OrgStructureId',
        'OrgStructure.StructureName',
        'Company.CompanyId',
        'Company.CompanyName',
      ],
      order: [['StructureName', 'ASC']],
    });

    res.status(200).json({ 
      success: true,
      data: reportData 
    });
  } catch (error) {
    console.error('Get designation summary error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch designation summary' 
    });
  }
};