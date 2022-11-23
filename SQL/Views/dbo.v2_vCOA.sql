SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

create view [dbo].[v2_vCOA]
with schemabinding
as
select 
	COA.COAID
	, A.AccountCode
	, S.SegmentID
	, S.SegmentLevel
	, A.Posting
	, A.AccountID
	, COA.COACode
	, COA.SS1
	, COA.SS2
	, COA.SS3
	, COA.SS4
	, COA.SS5
	, COA.SS6
	, COA.SS7
	, COA.SS8
	, COA.ProdID
	, A.ParentID
	, COA.detaillevel
	, A.AccountName
	, AT.AccountTypeName
	, AT.Code as AccountTypeCode
	--, PA.ChildCount
from
	dbo.COA as COA
join dbo.tblAccounts A
	on COA.AccountID = A.AccountID
--left join (select ParentID as AccountID, count(1) as childcount from tblAccounts A where A.sublevel>1 group by ParentID) PA
--	on A.AccountID = PA.AccountID
join dbo.AccountType AT
	on A.AccountTypeID = AT.AccountTypeID
join dbo.Segment S
	on A.SegmentID = S.SegmentID and S.Classification = 'Detail'

GO