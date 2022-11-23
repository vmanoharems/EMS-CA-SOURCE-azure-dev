SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--AtlasUtilities_SegmentsJSON 14

CREATE procedure [dbo].[AtlasUtilities_SegmentsJSON]
(
@ProdID int 
)
as
select 
	Segments.SegmentCode 
	, Segments.Classification
	, Segments.CodeLength
	, Segments.SegmentName
	, Accounts.AccountCode 
	, Accounts.AccountID 
	, Accounts.AccountTypeID 
from Segment Segments
join tblAccounts Accounts
on Segments.SegmentID = Accounts.SegmentID
and Segments.ProdID = Accounts.ProdID
where Segments.ProdID = @ProdID and Accounts.ProdID = @ProdID
order by Segments.SegmentLevel, Accounts.AccountCode
for JSON Auto
GO