<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Relevé de notes</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }

        body {
            color: #1a1a1a;
            font-family: 'Times New Roman', Times, serif;
            max-width: 800px;
            margin: auto;
            padding: 30px;
            box-shadow: 1px 1px 4px #1a1a1a;
            page-break-after: always;

        }

        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            top: 2%;
        }

        .center {
            position: relative;
            left: 38%;
            bottom: 12%;
        }

        .title {
            border: 2px solid black;
            text-align: center;
            padding: 10px;
            margin: 20px 0;
            font-size: 32px;
            font-family: 'Times New Roman', Times, serif;
            text-transform: uppercase;
            font-weight: bold;
            position: relative;
            bottom: 8%;

        }

        .info {
            padding: 20px;
            margin-bottom: 10px;
            position: relative;
            bottom: 6%;

        }

        .info .nom {

            margin-bottom: 22px;

        }

        table {

            width: 100%;
            border-collapse: collapse;
            position: relative;
            bottom: 5%;

        }

        table,
        th,
        td {

            border: 1px solid black;

        }

        th,
        td {

            padding: 8px;

            font-size: 18px;

        }

        th {

            background: #eee;

        }

        .footer {

            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            position: relative;
            bottom: 3%;
        }

        .signature {

            text-align: center;
            position: relative;
            left: 35%;
            bottom: 29%;
        }

        .right {
            font-size: 108%;
            text-align: right;
            position: relative;
            bottom: 21%;
            left: 2%;

        }

        .annee {
            direction: rtl;
            position: relative;
            bottom: 59px;
            right: 40px;
        }

        .moyenneGeneral {
            width: 55%;
            margin-left: 45%;
            margin-top: 20px;
            justify-content: right;
        }

        .noteFinal {
            width: 56%;
        }
    </style>
</head>

<body>

@foreach ($result as $item)
    <div>

        <!-- HEADER -->
        <div class="header">
            <div class="arabic">
                <img src="{{ public_path('centre.png') }}" style="width:28%;position:relative;bottom:1px">
            </div>

            <div class="center">
                <img src="{{ public_path('fadl-02-150x150.png') }}">
            </div>

            <div class="right">
                <strong>Centre Al-Fadl Développement humain</strong>
                <br>
                BERKANE, MAROC
            </div>
        </div>

        <!-- TITLE -->
        <div class="title">

            Relevé de notes
        </div>

        <!-- INFOS -->
        <div class="info">
            <div class="nom"><strong>Nom et Prénom :</strong> {{ $item['stagiaire']->nom }}
                {{ $item['stagiaire']->prenom }}
            </div>
            <div><strong>Formation :</strong> {{ $item['stagiaire']->formation->intitule }}</div>
            <div class="annee"><strong>Session :</strong> {{ $item['data']['anneeEnCours'] }}</div>
        </div>

        <!-- TABLE -->
        <table>
            <thead>
            <tr>
                <th>Module</th>
                <th>Moyenne</th>
                <th>Observation</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{ $item['stagiaire']->formation->intitule }}</td>
                <td style="text-align: center">{{ $item['data']['moyenneBranche'] }}</td>
                <td></td>
            </tr>

            @foreach ($item['data']['moyennesParModule'] as $module)
                <tr>
                    <td>{{ $module['module_nom'] }}</td>
                    <td style="text-align: center">{{ $module['moyenneModule'] }}</td>
                    <td></td>
                </tr>
            @endforeach
            <tr>
                <td>Stage</td>
                <td style="text-align: center">{{ $item['data']['noteStage'] }}</td>
                <td></td>
            </tr>
            <tr>
                <td>Discipline</td>
                <td style="text-align: center">{{ $item['data']['noteDiscipline'] }}</td>
                <td></td>
            </tr>
            </tbody>
        </table>

        <!-- SYNTHÈSE -->
        <br>
        <table class="moyenneGeneral">
            <tr>
                <td><strong>Moyenne Générale</strong></td>
                <td class="noteFinal" style="padding-left: 15px">{{ $item['data']['moyenneGenerale'] }}</td>
            </tr>
            <tr>
                <td><strong>Décision</strong></td>
                <td class="noteFinal" style="padding-left: 15px">

                    {{ $item['data']['moyenneGenerale'] >= 10 ? 'Admis' : 'Redoublant' }}
                </td>
            </tr>
        </table>

        <!-- FOOTER -->
        <div class="footer">
            <div>

                Fait à ..........., le ...........
            </div>

            <div class="signature">

                Signature du Directeur
            </div>
        </div>
    </div>
@endforeach

</body>

</html>
