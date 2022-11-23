CREATE PROCEDURE [dbo].[GetCRWRollUpReport]    -- exec GetCRWRollUpReport -1,-1,66
(
    @BudgetFileID int,
	@BudgetID int,
	@Prodid int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;
	declare @CurrentOpenPeriodID int;
	set @CurrentOpenPeriodID = dbo.GetCurrentOpenPeriodID(1,default);

	declare @COAIDFilter table (COAID INT not null, UNIQUE NONCLUSTERED ([COAID]));
	DECLARE @segmentJSON nvarchar(100);
	declare @Episode varchar(100);

	SELECT @segmentJSON=SegmentJSON FROM bUDGETV2 WHERE bUDGETid = @bUDGETid;
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
				, '01|00|' + J.[value] as ParentCode --- << Need to create non-hard coded solution
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

SELECT
 null as CHILD
 , COA.AccountCode
 , COA.ParentID as PARENT
 , COA.detaillevel
 , COA.AccountName
 , COA.Posting
 , COA.ChildCount
 , COA.AccountTypeName
 , COA.AccountTypeCode as Code
 , null as COAID
 , null as GENERATION
 , null as HIERARCHY
 , null as NotesCount
 , null as ExpandValue
 , null as BlankBudget
 , null as BlankEFC
 , CRW.Budget
 , COA.ActivityPO as POAmount
 , COA.ActivityT as ActualtoDate
 , COA.ActivityP as ActualthisPeriod
 --, case when COA.ActivityT > CRW.EFC then COA.ActivityT else isnull(CRW.EFC, 0.00) end as EFC
 , isnull(CRW.EFC, 0.00)  as EFC
 , (isnull(CRW.EFC,0.00) - isnull(COA.ActivityT,0.00)) as ETC
 , CRW.Budget as Budget1
 , COA.ActivityPO as POAmount1
 , COA.ActivityT as ActualtoDate1
 , COA.ActivityP as ActualthisPeriod1
from
	(select COA.AccountCode, COA.ParentID, COA.detaillevel, COA.AccountName, COA.Posting, COA.AccountTypeName, COA.AccountTypeCode
		, isnull(PA.ChildCount,0) as ChildCount
		, sum(POC.ActivityPO) as ActivityPO
		, sum(Actuals.ActivityT) as ActivityT
		, sum(Actuals.ActivityP) as ActivityP
		from [v2_vCOA] COA
		join @COAIDFilter CF on COA.COAID = CF.COAID
		left join (select ParentID as AccountID, count(1) as childcount from tblAccounts A where A.sublevel>1 group by ParentID) PA
		on COA.AccountID = PA.AccountID
		left join
		(
			select JED.COAID
			, sum(JED.DebitAmount - JED.CreditAmount) as ActivityT
			, sum(case when JE.ClosePeriod = @CurrentOpenPeriodID then JED.DebitAmount - JED.CreditAmount else null end) as ActivityP
			from JournalEntryDetail JED
			join JournalEntry JE
			on JED.JournalEntryID = JE.JournalEntryID
			join @COAIDFilter CF on JED.COAID = CF.COAID
			where JE.AuditStatus = 'Posted' and JE.PostedDate is not null
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
			join @COAIDFilter CF on POL.COAID = CF.COAID
			where PO.Status in ('Open','Partial')
			group by POL.COAID
		) as POC
		on COA.COAID = POC.COAID
		where COA.AccountTypeCode in ('EX','EA','EB','EC','ED','EE','EF','EG')
		and COA.ProdID = @ProdID
		group by COA.AccountCode, COA.ParentID, COA.detaillevel, COA.AccountName, COA.Posting, COA.AccountTypeName, COA.AccountTypeCode
		, PA.ChildCount 
	) as COA
left join
	(
		select CRW.Accountcode, sum(CRW.Budget) as Budget, sum(CRW.EFC) as EFC--, (CRW.Budget - CRW.EFC) as ETC
		from CRWv2 CRW
		, (select B.BudgetID, max(version) as maxversion from CRWv2 join Budgetv2 B on CRWv2.BudgetID = B.BudgetID where B.Active=1 and (B.BudgetID = @BudgetID or @BudgetID = -1) group by B.BudgetID) as V
		where (
			--(
			CRW.BudgetID = @BudgetID --and CRW.BudgetID = V.BudgetID)
			OR (@BudgetID = -1
				and CRW.BudgetID = V.BudgetID
				and CRW.version = V.maxversion
			)
		AND (CRW.version = @BudgetFileID
			OR (@BudgetFileID = -1 
				and CRW.BudgetID = V.BudgetID
				and CRW.version = V.maxversion
				)
			)
		)
		group by CRW.AccountCode
	) as CRW
on COA.AccountCode = CRW.AccountCode
order by COA.AccountCode
;
return;

		
Declare @Mtree TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,POAmount1 decimal(18,2) null
,ActualtoDate1 decimal(18,2) null,ActualthisPeriod1 decimal(18,2) null, NotesCount int null,ExpandValue int,Type varchar(50),
ActualtoDateWithOutSet decimal(18,2) null,ActualthisPeriodWithOutSet decimal(18,2) null,SetBudget decimal(18,2),
SetEFC decimal(18,2),BlankBudget decimal(18,2),BlankEFC decimal(18,2)
)

Insert into @Mtree
	exec [dbo].[GetCRWInfo] @BudgetFileID,@BudgetID,@Prodid;
	


   declare @COAID2 int;
   declare @detailLevel2 int;  
   declare @Budget2 decimal(18,2);
   declare @POAmount2 decimal(18,2);
   declare @ActualtoDate2 decimal(18,2);
   declare @ActualthisPeriod2 decimal(18,2);
   declare @NotesCount2 int;
   declare @ChildCount2 int;

   declare @SetAmt decimal(18,2);
   declare @SetEFC decimal(18,2);
   declare @BlankBudget decimal(18,2);
   declare @BlankEFC decimal(18,2);

   declare @aa1 int;
   declare @aa2 int;
   declare @aa3 int;
   declare @aa4 int;
   declare @aa5 int;
   declare @L2B decimal(18,2);
   declare @L2C int;
   declare @L2DB int;
   declare @Adjust int;

   declare @OldLevel int;
   set @OldLevel=0;

   DECLARE Cus_Category CURSOR FOR 
   select COAID,detaillevel,Budget ,POAmount,ActualtoDate,ActualthisPeriod,ChildCount,SetBudget,SetEFC,BlankBudget,BlankEFC from @Mtree
	
     open Cus_Category;
     fetch next from Cus_Category into @COAID2,@detailLevel2,@Budget2 ,@POAmount2,@ActualtoDate2,@ActualthisPeriod2,@ChildCount2
	 ,@SetAmt,@SetEFC,@BlankBudget,@BlankEFC

     while @@FETCH_STATUS = 0
     begin

	   select @NotesCount2= count(COAID) from CRWNotesNew where COAID=@COAID2 and BudgetFileID=@BudgetFileID and BudgetID=@BudgetID and ProdID=@Prodid;

	   if(@detailLevel2=1)
		begin
	     set @aa1=@COAID2;
		 update @Mtree set POAmount1=@POAmount2,ActualtoDate1=@ActualtoDate2,ActualthisPeriod1=@ActualthisPeriod2,Budget1=Budget1+SetBudget+BlankBudget, NotesCount=@NotesCount2 where COAID=@aa1;
		 set @OldLevel=1;
		end
		
		else if(@detailLevel2=2)
		begin		  
		    set @aa2=@COAID2;
		    --update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa1;
			 update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+BlankBudget where COAID=@aa2;
	        set @OldLevel=2;		
		end

		else if(@detailLevel2=3)
		begin
		   set @aa3=@COAID2;
		   update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
		   update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa2;
	       update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget+@SetAmt+@BlankBudget where COAID=@aa3;  
		   set @OldLevel=3;
		end

		else if(@detailLevel2=4)
		begin
		    set @aa4=@COAID2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa3;
	        update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+@BlankBudget where COAID=@aa4; 
		    set @OldLevel=4;
		end

		else if(@detailLevel2=5)
		begin
		    set @aa5=@COAID2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa1;
			update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa2;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2 where COAID=@aa3;
	    	update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,Budget1=Budget1+@Budget2+@SetAmt+@BlankBudget where COAID=@aa4;
		    update @Mtree set POAmount1=POAmount1+@POAmount2,ActualtoDate1=ActualtoDate1+@ActualtoDate2,ActualthisPeriod1=ActualthisPeriod1+@ActualthisPeriod2,NotesCount=@NotesCount2,Budget1=Budget1+SetBudget+@BlankBudget where COAID=@aa5; 
			set @OldLevel=5;
		end
 
        fetch next from Cus_Category into @COAID2,@detailLevel2,@Budget2 ,@POAmount2,@ActualtoDate2,@ActualthisPeriod2,@ChildCount2,@SetAmt ,@SetEFC,@BlankBudget,@BlankEFC
	 end
     CLOSE Cus_Category
     DEALLOCATE Cus_Category

	 --select * from @Mtree
	

   declare @CHILDn Int;
   declare @AccountCoden varchar(50);
   declare @PARENTn Int;
   declare @detailleveln Int;
   declare @COAIDn Varchar(30);
   declare @AccountNamen varchar(100);
   declare @Budgetn decimal(18,2);
   declare @Postingn bit;
   declare @POAmountn decimal(18,2);
   declare @ActualtoDaten decimal(18,2);
   declare @ActualthisPeriodn decimal(18,2);
   declare @EFCn decimal(18,2);
   declare @ETCn decimal(18,2);
   declare @ChildCountn int;
   declare @GENERATIONn int;
   declare @hierarchyn varchar(500);
   declare @Budget1n decimal(18,2);
   declare @POAmount1n decimal(18,2);
   declare @ActualtoDate1n decimal(18,2);
   declare @ActualthisPeriod1n decimal(18,2);
   declare @NotesCountn int;
   declare @ExpandValuen int;
   declare @ActualtoDatenWithOutSet decimal(18,2);
   declare @ActualthisPeriodnWithOutSet decimal(18,2);
  


Declare @CrwTable TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,
POAmount1 decimal(18,2) null,ActualtoDate1 decimal(18,2) null
,ActualthisPeriod1 decimal(18,2) null, NotesCount int null,ExpandValue int,BlankBudget decimal(18,2),BlankEFC decimal(18,2)
)


    DECLARE Cus_Category1 CURSOR FOR 
    select CHILD ,AccountCode ,PARENT ,detaillevel ,COAID ,AccountName ,
Budget ,Posting ,POAmount ,ActualtoDate ,ActualthisPeriod ,
EFC ,ETC ,ChildCount ,GENERATION ,hierarchy , Budget1 ,
POAmount1 ,ActualtoDate1 ,ActualthisPeriod1,NotesCount,ExpandValue,ActualtoDateWithOutSet,ActualthisPeriodWithOutSet,BlankBudget from @Mtree
	
     open Cus_Category1;
     fetch next from Cus_Category1 into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,@ActualtoDatenWithOutSet,
	@ActualthisPeriodnWithOutSet,@BlankBudget

     while @@FETCH_STATUS = 0
      begin

 if(@Postingn=1)
 begin
	
	   insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,0,0);

   --insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln+1 ,@COAIDn ,'(Blank)' ,@Budgetn ,
   -- @Postingn ,@POAmountn , @ActualtoDatenWithOutSet ,@ActualthisPeriodnWithOutSet , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
   -- @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,0,@ExpandValuen,@BlankBudget,[dbo].[GetBlankEFC](@COAIDn,@BudgetID,@BudgetFileID));

 end
 else
 begin
	    insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
        @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
        @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,0,0);
	
 end
	
	  
       fetch next from Cus_Category1 into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n,@NotesCountn,@ExpandValuen,
	@ActualtoDatenWithOutSet,@ActualthisPeriodnWithOutSet,@BlankBudget
end
 CLOSE Cus_Category1
 DEALLOCATE Cus_Category1

 
	 
	( select a.CHILD ,a.AccountCode ,a.PARENT ,a.detaillevel ,a.COAID ,a.AccountName ,
a.Budget ,a.Posting ,a.POAmount ,a.ActualtoDate ,a.ActualthisPeriod ,
a.EFC ,a.ETC ,a.ChildCount ,a.GENERATION ,a.hierarchy , a.Budget1 ,
a.POAmount1 ,a.ActualtoDate1 ,a.ActualthisPeriod1 , a.NotesCount ,a.ExpandValue,a.BlankBudget,a.BlankEFC
,c.AccountTypeName,c.Code
 from @CrwTable as a

 inner join TblAccounts as b on a.AccountCode=b.AccountCode inner join AccountType as c on b.AccountTypeid=c.AccountTypeID   )
 union all
 (
  select 9999858,'01-01' ,0,1 ,'99999','Extra' 
  ,0 ,cast(1 as bit) ,0 , 0 ,0 ,
   0 , 0 , 0 , 0 ,'0', 0 
   ,0 ,0 , 0,0,0,0,0,'ABCVijay','ZZ'
		) 
		order by c.Code ,hierarchy
END
	



GO