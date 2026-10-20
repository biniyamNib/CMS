export const checkLicenseExpiry = (licenses) => {
    const today = new Date();
    const reminders = licenses.map((license) => {
    const expiryDate = new Date(license.expiryDate);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 30 && diffDays > 0 && license.status === 'Active') {
        return {
        id: license.id,
        message: `License "${license.licenseType}" expires in ${diffDays} days.`,
        type: 'warning',
        };
    }
    return null;
    }).filter(Boolean);
    return reminders;
};