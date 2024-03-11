import { formPaginationUrl } from './texts';
import { getTotalRemaining } from './numbers';

export const filterReqProps = (arrKeys, obj) => {
  return arrKeys.reduce((accumulator, key) => {
    if (obj[key]) {
      accumulator[key] = obj[key];
    }
    return accumulator;
  }, {});
};

export const createPaginationObj = ({
  url,
  offset,
  limit,
  filters = '',
  total,
}: {
  url: string;
  offset: number;
  limit: number;
  filters?: string;
  total: number;
}) => {
  const remaining = getTotalRemaining(total, limit, offset);
  const next = offset + limit;
  const currentRows = total - (offset + remaining);
  const pagination = {
    current_rows: currentRows,
    prev_page: '',
    next_page: '',
    remaining_data: remaining,
    page: `${next > total ? total : next}/${total}`,
  };

  if (filters.includes(' ')) {
    filters = filters?.replaceAll(' ', '_');
  }

  if (offset > 0) {
    const prev = offset - limit;
    pagination.prev_page = formPaginationUrl({
      url,
      offset: prev > 0 ? prev : 0,
      limit,
      filters,
    });
  }

  if (next <= total && remaining > 0) {
    pagination.next_page = formPaginationUrl({
      url,
      offset: next,
      limit,
      filters,
    });
  }

  return pagination;
};
