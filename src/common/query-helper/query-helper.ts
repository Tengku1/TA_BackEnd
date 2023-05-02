export class QueryHelper {

    static mapKeys(objs: Object, objsReplace: Object) {
        let newObj = {};
        Object.keys(objs).forEach(function (key) {
            let value = objs[key];
            let newKey = key;
            if (objsReplace[newKey])
                newKey = objsReplace[newKey];
            newObj[newKey] = value;
        });
        return newObj;
    }

    static buildSearchQuery(fields: string[], query) {
        let fillField = [];
        fields.forEach(f => {
            fillField.push(`${f} ilike :param`);
        });

        return {
            key: '(' + fillField.join(' or ') + ')',
            value: { param: `%${query}%` }
        };
    }

    static buildDateQuery(field, startDate, endDate) {
        let key;
        let value;
        if (startDate == endDate) {
            key = `CAST(${field} at time zone 'Asia/Jakarta' AS DATE) = :startDate`;
            value = { startDate: startDate };
        } else {
            key = `${field} at time zone 'Asia/Jakarta' BETWEEN :startDate::date AND :endDate::date + interval '1' day`;
            value = { startDate: startDate, endDate: endDate };
        }
        return { key, value };
    }

    static buildDateQueryOperator(field, operator, date) {
        let key = `CAST(${field} AS DATE) ${operator} :date`;
        let value = { date };
        return { key, value };
    }
}