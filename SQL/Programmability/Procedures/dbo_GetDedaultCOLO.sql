SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetDedaultCOLO]   -- GetDedaultCOLO 3  
@ProdID int 

AS
BEGIN

	SET NOCOUNT ON;
/*	declare @CompanyCount varchar(200);
    declare @CompanyLO varchar(200);

	set @CompanyCount = (select top(1) CompanyCode from Company where ProdID = @ProdID)

	set @CompanyLO = (select Count(*) CompanyCode from Company )
*/
select
case when CO.COCount >1 then '' else CO.COACode end as COCOA
,case when CO.COCount >1 then '' else CO.SS1 end as Company
,case when CO.COCount >1 then null else CO.COAID end as COCOAID

, case when LO.LOCount>1 then '' else LO.COACode end as LOCOA
,case when LO.LOCount >1 then '' else LO.SS2 end as Location
,case when LO.LOCount >1 then null else LO.COAID end as LOCOAID
from
(
select COACode, SS1, COAID, (select count(*) from COA where SS2 = '') as COCount
	from COA where SS2 = '' group by COACode, SS1,COAID
) as CO 
left join
(
select COACode, SS1, SS2, COAID, (select count(*) from COA where SS3 = '' and SS2 <>'' ) as LOCount
	from COA where SS3 = '' and SS2 <> '' group by COACode,SS1, SS2,COAID
) as LO
on CO.SS1=LO.SS1
join Company C
on CO.SS1 = C.CompanyCode
where C.ProdID = @ProdID
group by 
case when CO.COCount >1 then '' else CO.COACode end 
,case when CO.COCount >1 then '' else CO.SS1 end 
,case when CO.COCount >1 then null else CO.COAID end 
, case when LO.LOCount>1 then '' else LO.COACode end 
,case when LO.LOCount >1 then '' else LO.SS2 end 
,case when LO.LOCount >1 then null else LO.COAID end 

/*
	If (@CompanyLO = 1)
		begin
			select  top (1) CO.COACode as COCOA,CO.SS1 as Company , CO.COAID as COCOAID ,LO.SS2 as Location
			 , LO.COACode as LOCOA, LO.COAID as LOCOAID
			 from COA CO ,COA LO where CO.SS2='' and LO.SS3='' and LO.ParentCode=@CompanyCount
		end
	else
		begin
		--  select  '' as COCOA,'' as Company , '' as COCOAID ,'' as Location , '' as LOCOA, '' as LOCOAID 
			select   CO.COACode as COCOA,CO.SS1 as Company , CO.COAID as COCOAID ,LO.SS2 as Location
				 , LO.COACode as LOCOA, LO.COAID as LOCOAID from COA CO ,COA LO where CO.SS2='' and LO.SS3='' and LO.ParentCode=@CompanyCount
		end
*/
END
GO