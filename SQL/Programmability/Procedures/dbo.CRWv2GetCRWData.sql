CREATE procedure [dbo].[CRWv2GetCRWData] (
--declare
@JSONParameters nvarchar(max)
) as
BEGIN
/*
declare @DebugParameters nvarchar(max) = 
--CRWv2GetCRWData 
'{
		"ProdID": 66
		, "BudgetID": -1
	}';
set @JSONParameters = @DebugParameters;
*/

Declare @BudgetID int = JSON_VALUE(@JSONParameters, '$.BudgetID');
declare @ProdID int = JSON_VALUE(@JSONParameters, '$.ProdID');
declare @isdebug bit = 1;
declare @debugmsg varchar(max) = '';

DECLARE @cols NVARCHAR(MAX)
	, @sql NVARCHAR(MAX)
	, @cols_tablevar NVARCHAR(MAX)
	, @sql_tablevar NVARCHAR(MAX)
	, @cols_CRWv2 NVARCHAR(MAX)
	, @sql_CRWv2 NVARCHAR(MAX)
	, @sql_where_budget NVARCHAR(MAX)
	, @sql_CRWID nvarchar(10) = 'NULL as CRWID'
;

declare @segmentJSON nvarchar(200);

if @BudgetID <> -1
	BEGIN
		select @segmentJSON = segmentJSON from Budgetv2 where BudgetID = @BudgetID and ProdID = @ProdID;
		if @segmentJSON <> '{}'
			BEGIN
				set @sql_where_budget = STUFF((select  ', COA.[' + dt.[key] + '] = ''' + dt.value + ''''
					from 
					(
						select * from OPENJSON(@segmentJSON)
					) as dt
					for XML Path(''),TYPE).value('.','NVARCHAR(MAX)'),1,1,'')
					;

			END
		set @debugmsg = @debugmsg + '-1 BudgetID
		';
		set @sql_CRWID = 'C.ID as CRWID';
	END
/*********************************************
The CRWv2 data requires pulling Cost related data from the JE and PO tables as well as the Budget/CRWv2 data and tying it all together based upon the COAID being converted into the dynamic segments
First, we transpose the dynamic segments into columns (e.g. Segments of CO, LO, EP will be transposed into columns with the same names)
	We get that for the COA_map, JE data, and for pulling from the segmentJSON from the Budgetv2 table
Next, we build the sql for creating the COA_map table variable and insert the map values from the COA table
Then we join our COA_map table variable to our Cost data and our Budget/CRWv2 data so that we can return the values as JSON
**********************************************/
	-- generate our list of columns from the segments table
set @cols = STUFF((select distinct ', SS' + cast(dt.SegmentLevel as varchar(2)) +QUOTENAME(dt.SegmentCode)
	from 
	(
		select S.SegmentID, S.SegmentCode, S.SegmentLevel
		from Segment S
		where S.Classification not in ('Set', 'Series', 'Detail')
		and ProdID = @ProdID
	) as dt
	order by 1
	for XML Path(''),TYPE).value('.','NVARCHAR(MAX)'),1,1,'')
	;
set @debugmsg = @debugmsg + '
	@cols: ' + @cols;

set @cols_tablevar = STUFF((select  ', '+QUOTENAME(dt.SegmentCode)
	from 
	(
		select S.SegmentID, S.SegmentCode, S.SegmentLevel
		from Segment S
		where S.Classification not in ('Set', 'Series', 'Detail')
		and ProdID = @ProdID
	) as dt
	order by dt.SegmentLevel
	for XML Path(''),TYPE).value('.','NVARCHAR(MAX)'),1,1,'')
	;
set @debugmsg = @debugmsg + '
	@cols_tablevar: ' + @cols_tablevar;

set @cols_CRWv2 = STUFF((select  ', JSON_VALUE(B.segmentJSON,''$.' + dt.SegmentCode + ''') as ' + dt.SegmentCode 
	from 
	(
		select S.SegmentID, S.SegmentCode, S.SegmentLevel
		from Segment S
		where S.Classification not in ('Set', 'Series', 'Detail')
		and ProdID = @ProdID
	) as dt
	order by dt.SegmentLevel
	for XML Path(''),TYPE).value('.','NVARCHAR(MAX)'),1,1,'')
	;
set @debugmsg = @debugmsg + '
	@cols_CRWv2: ' + @cols_CRWv2;

set @sql_tablevar = 'declare @COA_map table (ParentAccount nvarchar(50) not null, ParentName nvarchar(200) not null
	, AccountCode nvarchar(50) not null index idxAC CLUSTERED
	, AccountName nvarchar(200) not null' 
	if @cols_tablevar <> '[]'
		set @sql_tablevar = @sql_tablevar + ',' + replace(@cols_tablevar,']','] varchar(50)') 
set @sql_tablevar = @sql_tablevar 
	+ ', COAID int not null
	, UNIQUE NONCLUSTERED ([COAID]) 
	) ';

set @sql_CRWv2 = ';declare @CRW table (CRWID int null, BudgetID int not null, BudgetName varchar(100), BudgetType tinyint, segmentJSON nvarchar(200), ' + replace(@cols_tablevar,']','] varchar(50)') 
	+ ', AccountCode nvarchar(50) not null index CRWAC CLUSTERED, version int not null, EFC money, Budget money, Notes varchar(200))
		;'
	+ ' insert into @CRW 
		' 
	+ ' select '
	+ @sql_CRWID
	+ ' , B.BudgetID, B.BudgetName, B.BudgetType, B.segmentJSON, ' + @cols_CRWv2
	+ ' , C.AccountCode, C.version, C.EFC, C.Budget, C.Notes
		from Budgetv2 B
		join CRWv2 C
		on B.BudgetID = C.BudgetID
		join (select BudgetID, max(version) as currentversion from CRWv2 group by BudgetID) CMax
		on C.BudgetID = CMax.BudgetID and C.version = CMax.currentversion
		where B.Active=1
		'
	+ 'and ProdID = ' + cast(@ProdID as varchar(3))
	;
if @BudgetID <> -1 
	set @sql_CRWv2 = @sql_CRWv2 + '
		and B.BudgetID = ' + cast(@BudgetID as varchar(10))
	;

set @sql = @sql_tablevar + '; 
	insert into @COA_map 
	select
	case when AP.AccountID is null then A.AccountCode  else AP.AccountCode end as ParentAccount
	, case when AP.AccountID is null then A.AccountName else AP.AccountName end as ParentName
	, A.AccountCode,A.AccountName, ' + @cols + '
	, COA.COAID
	from COA
	join tblAccounts A
	on COA.AccountID = A.AccountID
	left join (
		select 
		A.AccountID
		, A.AccountCode
		, A.AccountName
		, A.ParentID
		, LA.LedgerID
		, LA.AccountCode as AccountCode_LA
		, LA.AccountName as AccountName_LA
		from tblAccounts A
		join LedgerAccounts LA
		on A.ParentID = LA.LedgerID
		--select * from tblAccounts A
		where A.SegmentType=''Detail'' and A.Sublevel=1
	) AP
	on ((A.ParentID = AP.AccountID and A.Sublevel = 2) or (A.ParentID = AP.LedgerID and A.Sublevel=1)) and A.ParentID = AP.AccountID
	--on A.ParentID = AP.AccountID
	join AccountType AT 
	on A.AccountTypeID = AT.AccountTypeID
	where A.SegmentType=''Detail''
	and AT.Code in (''EX'',''EA'',''EB'',''EC'',''ED'',''EE'',''EF'',''EG'')
	'
	+ 'and COA.ProdID = ' + cast(@ProdID as varchar(3))
	;
set @sql = @sql + '
	order by 1,2,3
	;
	declare @CurrentOpenPeriodID int;
	set @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(1,default);
	'
;
set @sql = @sql + @sql_CRWv2;

set @sql = @sql + ';
	declare @COAIDFilter table (COAID INT not null, UNIQUE NONCLUSTERED ([COAID]));
	DECLARE @segmentJSON nvarchar(100);
	declare @Episode varchar(100);

	SELECT @segmentJSON=SegmentJSON FROM bUDGETV2 WHERE BudgetID = ' + cast(@BudgetID as varchar(3)) + ';
	if isJSON(@segmentJSON)=1
	begin
		insert into @COAIDFilter 
		select COA.COAID
		from COA
		join (
			select J.[key] as JSONname
				, J.[value] as JSONvalue
				, J.[type] as JSONtype
				, S.SegmentID as S_SegmentID
				, S.SegmentCode as S_SegmentCode
				, S.Classification as S_Classification
				, A.AccountID as A_AccountID
				, A.AccountCode as A_AccountCode
				, ''01|00|'' + J.[value] as ParentCode --- << Need to create non-hard coded solution
			 from 
				OPENJSON(@segmentJSON) as J
				join Segment S on J.[key] = S.SegmentCode COLLATE DATABASE_DEFAULT
				join tblAccounts A on A.SegmentType = S.Classification and J.[value] = A.AccountCode COLLATE DATABASE_DEFAULT
		) as J
		on COA.ParentCode = J.ParentCode
	end 
	else
	begin
		insert into @COAIDFilter 
		select COA.COAID
		from COA		
	end

/**/
select 
--top 10
null as DT_RowId, dt.ParentAccount as PA, dt.ParentName as PN
, dt.AccountCode as AA, dt.AccountName as AN
, isnull((ActivityT), 0.00) as AT
, isnull((ActivityP), 0.00) as AP
, isnull((ActivityPO), 0.00) as APO
, (
	isnull(ActivityT,0)
	+ isnull(ActivityPO,0)
	) as TC
, isnull(ISNULL(EFC,0) - ISNULL(isnull(ActivityT,0) + isnull(ActivityPO,0),0), 0.00) as ETC
, isnull((EFC), 0.00) as EFC
, isnull((Budget), 0.00) as B
, isnull((Budget) - (EFC),0.00) as V
from
(
/**/
	select
	COA.ParentAccount
	, COA.ParentName
	, COA.AccountCode
	, COA.AccountName
	, sum(Actuals.ActivityT) as ActivityT
	, sum(Actuals.ActivityP) as ActivityP
	, sum(POC.ActivityPO) as ActivityPO
	--, CRW.EFC
	--, CRW.Budget
	--, CRW.Notes
	from @COA_MAP COA
	left join
	(
		select JED.COAID
		, sum(JED.DebitAmount - JED.CreditAmount) as ActivityT
		, sum(case when JE.ClosePeriod = @CurrentOpenPeriodID then JED.DebitAmount - JED.CreditAmount else null end) as ActivityP
		from JournalEntryDetail JED
		join JournalEntry JE
		on JED.JournalEntryID = JE.JournalEntryID
		JOIN @COAIDFilter CF ON JED.COAID = CF.COAID
		where JE.AuditStatus = ''Posted'' and JE.PostedDate is not null
		group by JED.COAID
	) as Actuals
	on COA.COAID = Actuals.COAID 
	left join
	(
		select POL.COAID
		, sum(AvailtoRelieve) as ActivityPO
		from PurchaseOrderLine POL
		join PurchaseOrder PO
		on POL.POID = PO.POID
		where PO.Status in (''Open'',''Partial'')
		group by POL.COAID
	) as POC
	on COA.COAID = POC.COAID
	'
	;
if @sql_where_budget <> ''
	set @sql = @sql + 'where ' + @sql_where_budget
/**/
set @sql = @sql + '
	group by COA.ParentAccount, COA.ParentName, COA.AccountCode, COA.AccountName
 ) as dt
	left join
	(select CRW.Accountcode, sum(EFC) as EFC, sum(Budget) as BUdget
		from @CRW as CRW
		group by CRW.AccountCOde
	) CRW
	on dt.AccountCode = CRW.AccountCode
 --group by CRW.CRWID, dt.ParentAccount, dt.ParentName, dt.AccountCode, dt.AccountName
 order by dt.AccountCode
 for JSON PATH
 ;
 --select * from @CRW ;
 --select * from @COA_map
 /**/
	'
	;

if @isdebug = 1
	begin
	--SELECT CAST('<root><![CDATA[' + @sql + ']]></root>' AS XML)
		print @debugmsg + '
			@sql: ' + @sql
		;
		--return;
	end

EXECUTE sp_executesql @sql;

END
GO