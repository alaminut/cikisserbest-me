import React from 'react';
import { List, ListSubheader } from '@material-ui/core';
import StatusRow from '@components/status-row/status-row';
import { Lockdown } from '@common/lockdown';
import { DateTime } from 'luxon';
import config from '@common/config.json';

const Dashboard = () => {
  return (
    <>
      <List dense>
        <ListSubheader>Yaş Gruplarına Göre Sokağa Çıkabilme Durumları</ListSubheader>
        {config.ageGroups.map(ages =>
          (<StatusRow key={ages.title}
                      title={ages.title}
                      status={Lockdown.status(DateTime.local().year - ages.age, false)} />
          ))
        }
      </List>
      <List dense>
        <ListSubheader>İşletme ve Tedarik Zinciri Durumları</ListSubheader>
        <StatusRow title='Temel ihtiyaç (bakkal, kasap, market vb...)' status={Lockdown.logistics('basic')} />
        <StatusRow title='Kafe & lokantalar (sadece sipariş)' status={Lockdown.logistics('basic')} />
        <StatusRow title='Sinema, tiyatro ve eğlence mekanları' status={Lockdown.logistics('entertainment')} />
      </List>
    </>
  );
};

export default Dashboard;
