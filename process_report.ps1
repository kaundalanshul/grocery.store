﻿$word = New-Object -ComObject Word.Application
$word.Visible = $false
$orig = "c:\Users\DELL\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\LocalState\sessions\6A515FEB7A2FB4DD4F4DC5040A187D0F05A5553B\transfers\2026-47\Seminar_Report.docx"
$docPath = "C:\Users\DELL\OneDrive\Desktop\grocery.store\Seminar_Report_Corrected.docx"
$pdfPath = "C:\Users\DELL\OneDrive\Desktop\grocery.store\Seminar_Report.pdf"
$desktopPdf = "C:\Users\DELL\OneDrive\Desktop\Seminar_Report.pdf"
$downloadsPdf = "C:\Users\DELL\Downloads\Seminar_Report.pdf"

# Clean copy from WhatsApp original
Copy-Item $orig $docPath -Force

$doc = $word.Documents.Open($docPath)

# Replace helper
function Replace-DocText($f, $r) {
    $find = $doc.Content.Find
    $find.ClearFormatting()
    $find.Replacement.ClearFormatting()
    [void]$find.Execute($f, $false, $false, $false, $false, $false, $true, 1, $false, $r, 2)
}

Write-Host "1. Replacing RAG remnants..."
Replace-DocText "Deploying LLMs in knowledge-intensive, real-world settings exposes a structural mismatch between how these models are trained and how they are used. This section formulates the core problem RAG addresses and explains why retrieval augmentation, rather than simply scaling parametric models further, is the solution." "Modern e-commerce ecosystems rely on multi-party coordination across buyers, sellers, payment processors, warehouses, and logistics carriers. This section formulates the fundamental trust and verification challenges in multi-tier supply chains and motivates the integration of a distributed, tamper-evident ledger."

Replace-DocText "This section discusses the technologies and methods that constitute a modern RAG pipeline, moving from overall architecture, through the retrieval and generation components, to the advanced and agentic techniques that extend the basic pipeline." "This section presents the foundational cryptographic mechanisms and distributed systems architecture supporting blockchain in e-commerce, spanning blocks, hashing, Merkle trees, consensus, smart contracts, and off-chain data management."

Replace-DocText "This section critically evaluates the strengths and limitations of the RAG paradigm and discusses representative application contexts and evaluation results from the literature." "This section presents a critical evaluation of blockchain adoption in e-commerce through an application study on order lifecycle provenance, analyzing both architectural benefits and practical implementation constraints."

Write-Host "2. Correcting section numbering jump..."
Replace-DocText "4.6 Suggested E-Commerce Architecture" "4.5 Suggested E-Commerce Architecture"
Replace-DocText "4.7 Security and Governance" "4.6 Security and Governance"

Write-Host "3. Correcting Title and Declaration..."
Replace-DocText "“Blockchain in E-Commerce: Applications, Benefits, and Challenges" "“Blockchain in E-Commerce: Applications, Benefits, and Challenges”"
Replace-DocText "[BACHELOR OF TECHNOLOGY IN COMPUTER SCIENCE  ] at [Himachal Pradesh Technical University Main Campus at Daruhi, Hamirpur ]." "Bachelor of Technology in Computer Science and Engineering at Himachal Pradesh Technical University Main Campus at Daruhi, Hamirpur."
Replace-DocText "return approval" "return approval."

Write-Host "4. Ensuring starting headings start on next page..."
$headings = @(
    "CANDIDATE",
    "ABSTRACT",
    "TABLE OF CONTENTS",
    "1. INTRODUCTION",
    "2. LITERATURE SURVEY",
    "3. PROBLEM FORMULATION AND MOTIVATION",
    "4. DISCUSSION ON METHODS AND TECHNOLOGY",
    "5. CRITICAL ANALYSIS AND APPLICATION STUDY",
    "6. SUMMARY AND CONCLUSION",
    "REFERENCES"
)

foreach ($p in $doc.Paragraphs) {
    $t = $p.Range.Text.Trim()
    
    if ($t -eq "/") {
        $p.Range.Text = ""
        continue
    }
    if ($t.EndsWith("/") -and $t.Contains("Blockchain")) {
        $p.Range.Text = $t.TrimEnd("/").Trim() + [char]13
        continue
    }
    if ($t -eq "INTRODUCTION") {
        $p.Range.Text = "1. INTRODUCTION" + [char]13
        $t = "1. INTRODUCTION"
    }

    foreach ($h in $headings) {
        if ($t -eq $h -or $t.StartsWith($h)) {
            $p.Range.ParagraphFormat.PageBreakBefore = $true
            break
        }
    }
}

Write-Host "5. Aligning page numbers to bottom center..."
foreach ($sec in $doc.Sections) {
    foreach ($fi in @(1, 2, 3)) {
        try {
            $ftr = $sec.Footers.Item($fi)
            if ($ftr.Exists) {
                foreach ($prg in $ftr.Range.Paragraphs) {
                    $prg.Alignment = 1
                }
                if ($ftr.PageNumbers.Count -gt 0) {
                    for ($idx = 1; $idx -le $ftr.PageNumbers.Count; $idx++) {
                        $ftr.PageNumbers.Item($idx).Alignment = 1
                    }
                }
            }
        } catch {}
    }
}

Write-Host "6. Updating Table of Contents table..."
if ($doc.Tables.Count -ge 1) {
    $tbl = $doc.Tables.Item(1)
    if ($tbl.Cell(1, 1).Range.Text -like "*Section*") {
        try {
            $tbl.Cell(2, 3).Range.Text = "1"
            $tbl.Cell(3, 3).Range.Text = "2"
            $tbl.Cell(4, 3).Range.Text = "5"
            $tbl.Cell(5, 3).Range.Text = "8"
            $tbl.Cell(6, 3).Range.Text = "12"
            $tbl.Cell(7, 3).Range.Text = "14"
            $tbl.Cell(8, 3).Range.Text = "16"
        } catch {}
    }
}

Write-Host "7. Saving and exporting to PDF..."
$doc.Save()
$doc.SaveAs([ref]$pdfPath, [ref]17)
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "8. Copying to Desktop and Downloads..."
Copy-Item $pdfPath $desktopPdf -Force
if (Test-Path "C:\Users\DELL\Downloads") {
    Copy-Item $pdfPath $downloadsPdf -Force
}
Copy-Item $docPath "C:\Users\DELL\OneDrive\Desktop\Seminar_Report.docx" -Force

Write-Host "SUCCESS: Report successfully processed and exported to PDF!"

