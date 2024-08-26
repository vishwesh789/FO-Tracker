import moment from 'moment';

export const formatDateToDDMMYYYY = (date: string): string => {
  return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
};

export const extractTime = (isoString: string): string => {
    return moment(isoString).format('HH:mm:ss');
  };