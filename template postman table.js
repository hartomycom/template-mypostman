var template = `
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
        crossorigin="anonymous">
<style type="text/css">
    body { font-size: 12px; background: #eee; padding: 16px;}
</style>
<table class="table table-striped">
    <thead>
        <tr>
            <th>COA_NUMBER</th>
            <th>NAMA_AKUN</th>
            <th>AWAL_DEBIT</th>
            <th>AWAL_KREDIT</th>
            <th>AKHIR_DEBIT</th>
            <th>AKHIR_KREDIT</th>
        </tr>
    </thead>

    <tbody>
        {{#each response.data}}
        <tr>
            <td>{{COA_NUMBER}}</td>
            <td>{{NAMA_AKUN}}</td>
            <td>{{AWAL_DEBIT}}</td>
            <td>{{AWAL_KREDIT}}</td>
            <td>{{AKHIR_DEBIT}}</td>
            <td>{{AKHIR_KREDIT}}</td>
        </tr>
        {{/each}}
    <tbody>
</table>
`;

// Set visualizer
pm.visualizer.set(template, {
    // Pass the response body parsed as JSON as `data`
    response: pm.response.json()
});